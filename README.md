<div align="center">

# Law-Lens AI — Subcontract Risk Detector

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=flat-square&logo=springboot&logoColor=white)](.)
[![Java](https://img.shields.io/badge/Java-17-007396?style=flat-square&logo=openjdk&logoColor=white)](.)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](.)
[![Llama-3-Ko](https://img.shields.io/badge/Llama--3--Open--Ko--8B-FF6B00?style=flat-square&logo=meta&logoColor=white)](.)
[![QLoRA](https://img.shields.io/badge/QLoRA-4bit-9B59B6?style=flat-square)](.)
[![FAISS](https://img.shields.io/badge/FAISS-RAG-005571?style=flat-square)](.)

</div>

---

하도급 거래 상황을 입력하면 위반 의심 조항, 법리 근거, 상세 사유를 자동으로 분석해주는 하도급법 전문 웹 서비스. Llama-3-Open-Ko-8B를 QLoRA로 파인튜닝하고 FAISS RAG를 결합한 추론 엔진을 Spring Boot 백엔드에서 호출하는 2-Tier 아키텍처입니다.

**자세한 포트폴리오 설명**: [`subcontract-risk-detector/README.md`](https://github.com/JHWwaI/subcontract-risk-detector)

---

## Quickstart

### Docker (권장)
```bash
cp .env.example .env
# .env의 LAWLENS_AUDIT_KEY를 `openssl rand -base64 32` 결과로 교체

# Mock 모드 — 모델 가중치 없이 풀스택 부팅
make up-mock

# 풀 모드 — 실제 LoRA 어댑터 + FAISS 인덱스 필요
make up

# 웹:    http://localhost:8080
# 추론:  http://localhost:8000/health
# 로그:  make logs
# 평가:  make eval
```

### 호스트 직접 실행

```bash
# 추론 (Mock)
cd 5_inference_api && ./run.bat        # Windows
# Linux/Mac: LAWLENS_MOCK_MODE=1 uvicorn main:app --port 8000

# Spring 웹
cd 6_spring_web && ./run.bat
# Linux/Mac: java -jar target/law-lens-web-1.0.0.jar
```

전제: Python 3.11+, Java 17. Redis 미설치 시 캐시만 우회 — 다른 기능 정상.

---

## 디렉토리

```
.
├── docker-compose.yml + Makefile + .env.example
├── 1_data_pipeline/    원시 판례 다운로드 + 합성 데이터 500건 생성
├── 2_vector_db/        FAISS 인덱스 구축 / 검색 테스트
├── 3_fine_tuning/      QLoRA 학습 (train_qlora.py) + 어댑터 저장
├── 4_serving/          api_server.py (초기 CLI) + app.py (구 Streamlit 데모)
├── 5_inference_api/    FastAPI 추론 서비스 + Dockerfile + Article whitelist
├── 6_spring_web/       Spring Boot 3.3 + JPA + Redis + PII 마스킹 + Resilience4j
├── 7_eval/             평가셋 200건 + generate_eval_set.py + run_eval.py
└── .github/workflows/  PR 회귀 평가 자동화
```

---

## 핵심 기능

- **QLoRA(4-bit) 파인튜닝** — Llama-3-Open-Ko-8B + 합성 500건 학습 (Loss 3.1973 → 0.1055)
- **FAISS RAG** — `jhgan/ko-sroberta-multitask` 임베딩 기반 법리 검색
- **Spring + FastAPI 2-Tier** — WebClient + Resilience4j(Retry, CircuitBreaker, fallback)
- **PII 마스킹 + 감사 로그** — AES-256-GCM 컬럼 암호화 + 90일 보존 정책
- **Redis 캐시** — SHA-256 키, 24h TTL, hit/miss Prometheus 메트릭
- **Correlation ID** — Spring MDC + WebClient 필터로 FastAPI까지 전파
- **Article 화이트리스트** — 학습 외 조항 응답을 환각으로 차단
- **GitHub Actions 회귀 평가** — PR마다 평가셋 200건 자동 실행, 임계치 미달 시 차단

---

## 라이선스 / Disclaimer

본 프로젝트는 PoC이며, 실제 법률 자문 도구로 사용하기 위해서는 변호사 검수와 실판례 기반 추가 학습이 필요합니다.

Base Model: `beomi/Llama-3-Open-Ko-8B` — Meta Llama 3 Community License 적용.
