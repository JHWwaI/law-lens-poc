"""
Law-Lens Inference API
Wraps the QLoRA fine-tuned Llama-3 + FAISS RAG pipeline as a REST service
so the Spring Boot frontend can call it over HTTP.

Two operating modes:
  - LAWLENS_MOCK_MODE=0 (default): full Llama-3 + LoRA adapter + FAISS RAG.
  - LAWLENS_MOCK_MODE=1: skip the 8B model load, return a deterministic
    rule-based response. Useful for boot-the-stack demos and integration
    tests without GPU/weights.
"""
import os
import re
import time
import uuid
import json
import logging
from contextvars import ContextVar
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field

request_id_ctx: ContextVar[str] = ContextVar("request_id", default="-")


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": self.formatTime(record, "%Y-%m-%dT%H:%M:%S"),
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
            "request_id": request_id_ctx.get(),
        }
        if record.exc_info:
            payload["exc"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False)


def _configure_logging() -> None:
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(logging.INFO)


BASE_MODEL = os.getenv("LAWLENS_BASE_MODEL", "beomi/Llama-3-Open-Ko-8B")
ADAPTER_PATH = os.getenv("LAWLENS_ADAPTER_PATH", "../3_fine_tuning/law_model_adapter")
DB_PATH = os.getenv("LAWLENS_DB_PATH", "../data/faiss_index")
DEVICE = os.getenv("LAWLENS_DEVICE", "cpu")
MOCK_MODE = os.getenv("LAWLENS_MOCK_MODE", "0") == "1"

_configure_logging()
logger = logging.getLogger("lawlens")

state = {"model": None, "tokenizer": None, "vector_db": None, "mode": "uninitialized"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    if MOCK_MODE:
        logger.info("Booting in MOCK mode — LLM weights skipped")
        state.update(mode="mock")
        # Optional: try to load FAISS if available, otherwise mock retrieval too
        try:
            from langchain_community.vectorstores import FAISS
            from langchain_huggingface import HuggingFaceEmbeddings
            embeddings = HuggingFaceEmbeddings(model_name="jhgan/ko-sroberta-multitask")
            state["vector_db"] = FAISS.load_local(DB_PATH, embeddings, allow_dangerous_deserialization=True)
            logger.info("FAISS index loaded in mock mode")
        except Exception as e:
            logger.warning("FAISS unavailable in mock mode, using stub retrieval: %s", e)
        yield
        state.clear()
        return

    # Full mode — heavy imports lazy so mock-mode container does not need torch
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    from peft import PeftModel
    from langchain_community.vectorstores import FAISS
    from langchain_huggingface import HuggingFaceEmbeddings

    logger.info("Loading tokenizer/model/vector-db (device=%s)", DEVICE)
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    base = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL, torch_dtype=torch.float32, device_map=DEVICE
    )
    model = PeftModel.from_pretrained(base, ADAPTER_PATH)
    model.eval()

    embeddings = HuggingFaceEmbeddings(model_name="jhgan/ko-sroberta-multitask")
    vector_db = FAISS.load_local(DB_PATH, embeddings, allow_dangerous_deserialization=True)

    state.update(model=model, tokenizer=tokenizer, vector_db=vector_db, mode="full")
    logger.info("Inference engine ready")
    yield
    state.clear()


app = FastAPI(title="Law-Lens Inference API", version="1.0.0", lifespan=lifespan)


@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    rid = request.headers.get("X-Request-Id") or str(uuid.uuid4())
    token = request_id_ctx.set(rid)
    try:
        response = await call_next(request)
    finally:
        request_id_ctx.reset(token)
    response.headers["X-Request-Id"] = rid
    return response


class DiagnoseRequest(BaseModel):
    fact: str = Field(..., min_length=5, max_length=2000, description="사실관계 텍스트")
    top_k: int = Field(1, ge=1, le=5)


class DiagnoseResponse(BaseModel):
    article: str | None
    conclusion: str
    retrieved_rule: str
    latency_ms: int


ARTICLE_RE = re.compile(r"제\s*\d+\s*조(?:의\d+)?")
ALLOWED_ARTICLES = {"제3조", "제11조", "제13조", "제12조의3"}


def _validate_article(candidate: str | None) -> str | None:
    if not candidate:
        return None
    normalized = re.sub(r"\s+", "", candidate)
    return normalized if normalized in ALLOWED_ARTICLES else None


# Mock 모드용 룰셋. 학습 데이터의 4조항을 키워드로 분기.
MOCK_RULES = [
    (("삭감", "감액", "깎", "차감", "공제"),
     "제11조",
     "하도급법 제11조(부당한 대금의 감액 금지) 위반 가능성이 높습니다. 자금 사정의 악화·환율 변동 등은 정당한 사유로 인정되지 않습니다."),
    (("계약서", "서면", "발주서", "구두", "전화"),
     "제3조",
     "하도급법 제3조(서면의 발급 및 서류의 보존) 위반 가능성이 높습니다. 모든 위탁 거래는 착수 전 서면 발급이 필수입니다."),
    (("지연", "미지급", "60일", "70일", "80일", "90일", "100일", "어음", "지연이자"),
     "제13조",
     "하도급법 제13조(하도급대금의 지급 및 지연이자) 위반 가능성이 높습니다. 60일 초과 지급 또는 지연이자 미정산은 시정명령 대상입니다."),
    (("기술", "도면", "유출", "노하우", "소스코드", "임치"),
     "제12조의3",
     "하도급법 제12조의3(기술유용행위 금지) 위반 가능성이 높습니다. 기술 자료 유용은 징벌적 손해배상 대상인 중대 위반입니다."),
]


def _mock_infer(fact: str) -> tuple[str | None, str, str]:
    """키워드 매칭 기반 룰엔진. 학습된 모델의 행동을 대략 흉내."""
    for keywords, article, conclusion in MOCK_RULES:
        if any(k in fact for k in keywords):
            return article, conclusion, f"하도급법 {article}"
    return None, "분석을 위한 정보가 부족합니다. 추가 사실관계를 입력해 주세요.", "관련 법령 없음"


@app.get("/health")
def health():
    return {
        "status": "ok",
        "mode": state.get("mode"),
        "model_loaded": state.get("model") is not None,
    }


@app.post("/infer", response_model=DiagnoseResponse)
def infer(req: DiagnoseRequest):
    started = time.time()

    if MOCK_MODE:
        # RAG 검색은 가능한 경우 실제 FAISS 사용, 아니면 룰의 retrieved_rule 사용
        vector_db = state.get("vector_db")
        retrieved_rule_from_rag = None
        if vector_db is not None:
            try:
                docs = vector_db.similarity_search(req.fact, k=req.top_k)
                if docs:
                    retrieved_rule_from_rag = docs[0].page_content
            except Exception as e:
                logger.warning("FAISS search failed in mock mode: %s", e)

        article, conclusion, fallback_rule = _mock_infer(req.fact)
        retrieved_rule = retrieved_rule_from_rag or fallback_rule
        return DiagnoseResponse(
            article=_validate_article(article),
            conclusion=conclusion,
            retrieved_rule=retrieved_rule,
            latency_ms=int((time.time() - started) * 1000),
        )

    # ── Full mode ──
    import torch  # already loaded at startup, safe to import here too
    model = state.get("model")
    tokenizer = state.get("tokenizer")
    vector_db = state.get("vector_db")
    if not (model and tokenizer and vector_db):
        raise HTTPException(503, "model not ready")

    docs = vector_db.similarity_search(req.fact, k=req.top_k)
    retrieved_rule = docs[0].page_content if docs else "관련 법령 없음"

    prompt = (
        f"### 사실관계:\n{req.fact}\n\n"
        f"### 관련 법리:\n{retrieved_rule}\n\n"
        f"### 결론:"
    )
    inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE)
    with torch.no_grad():
        output = model.generate(
            **inputs, max_new_tokens=120, temperature=0.1, do_sample=False
        )
    decoded = tokenizer.decode(output[0], skip_special_tokens=True)
    conclusion = decoded.split("### 결론:", 1)[-1].strip()

    match = ARTICLE_RE.search(conclusion) or ARTICLE_RE.search(retrieved_rule)
    raw_article = match.group(0).replace(" ", "") if match else None
    article = _validate_article(raw_article)
    if raw_article and not article:
        logger.warning("article rejected (not in whitelist): raw=%s", raw_article)

    return DiagnoseResponse(
        article=article,
        conclusion=conclusion,
        retrieved_rule=retrieved_rule,
        latency_ms=int((time.time() - started) * 1000),
    )
