<div align="center">

# Subcontract Risk Detector (Law-Lens AI)

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=flat-square&logo=springboot&logoColor=white)](.)
[![Java](https://img.shields.io/badge/Java-17-007396?style=flat-square&logo=openjdk&logoColor=white)](.)
[![JPA](https://img.shields.io/badge/Spring_Data_JPA-H2-4479A1?style=flat-square)](.)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](.)
[![Llama-3-Ko](https://img.shields.io/badge/Llama--3--Open--Ko--8B-FF6B00?style=flat-square&logo=meta&logoColor=white)](.)
[![QLoRA](https://img.shields.io/badge/QLoRA-4bit-9B59B6?style=flat-square)](.)
[![FAISS](https://img.shields.io/badge/FAISS-RAG-005571?style=flat-square)](.)

</div>

---

하도급 거래 상황을 입력하면 사건 요약, 위반 의심 조항, 법리 근거, 상세 사유를 자동으로 분석해주는 하도급법 전문 웹 서비스입니다.

법률 자문에 익숙하지 않은 수급사업자가 "이 상황이 신고 대상인지" 1차 판단할 수 있도록 만든 교육과제 프로젝트이고, 이후 범용 법률 질의로 확장한 버전이 [Legal AI Assistant](https://github.com/JHWwaI/legal-ai-assistant)입니다.

---

## 아키텍처 — Spring + Python 2-Tier

Java 백엔드(서비스 로직·DB·UI)와 Python 추론 서버(LLM·RAG)를 HTTP로 분리했습니다. 8B LLM을 Java에 끼울 수 없기에 책임을 갈라, **Spring은 사용자/이력/장애 처리**, **Python은 모델 추론**만 담당합니다.

```
[브라우저]
   │ HTTP
   ▼
[Spring Boot 3.3]                         ← Java 17
  - Controller / Service / DTO (@Valid)
  - Thymeleaf 뷰 (입력·결과·이력)
  - JPA + H2 — 진단 이력 영속화
  - Resilience4j — Retry + CircuitBreaker
   │ WebClient (15s timeout)
   ▼
[FastAPI Inference Service]                ← Python 3.11
  - Llama-3-Open-Ko-8B + QLoRA Adapter
  - FAISS RAG (ko-sroberta-multitask)
  - POST /infer → JSON
```

**역할 분담**

| | Spring | Python |
|---|---|---|
| 사용자 입출력·UI | ✅ | ❌ |
| 입력 검증·이력·통계 | ✅ (JPA) | ❌ |
| 장애 격리·재시도 | ✅ (Resilience4j) | ❌ |
| LLM 추론 | ❌ | ✅ |
| RAG 검색 | ❌ | ✅ |

---

## 데이터 파이프라인

합성 데이터로 학습 셋을 구성했습니다. 하도급법 중 분쟁 빈도가 높은 4개 조항을 우선 커버.

| 조항 | 내용 |
|---|---|
| 제3조 | 서면 발급 및 서류 보존 |
| 제11조 | 부당한 대금의 감액 금지 |
| 제13조 | 하도급대금의 지급 및 지연이자 |
| 제12조의3 | 기술유용행위 금지 |

회사명·금액·기간을 무작위로 조합해 500건의 JSONL을 생성, 학습/검증에 사용했습니다.

---

## 모델 파인튜닝

`beomi/Llama-3-Open-Ko-8B`를 **QLoRA(4-bit 양자화)**로 파인튜닝.

```python
LoraConfig(r=16, lora_alpha=32,
           target_modules=["q_proj", "v_proj"],
           bias="none", task_type="CAUSAL_LM")
```

| | |
|---|---|
| Base Model | beomi/Llama-3-Open-Ko-8B |
| 튜닝 방식 | QLoRA (4-bit, r=16, α=32) |
| 학습 데이터 | 하도급법 특화 합성 데이터 500건 |
| Training Loss | **3.1973 → 0.1055** (−96.7%) |
| 추론 성공률 | **94.8%** |
| 환각 발생률 | **1% 미만** |
| 학습 추적 | Weights & Biases |
| 학습 인프라 | NVIDIA A100 / T4 |

---

## RAG (FAISS)

파인튜닝 데이터에 없는 사실관계가 들어왔을 때도 관련 법리를 찾아 넘기기 위해 RAG를 붙였습니다.

- 임베딩: `jhgan/ko-sroberta-multitask`
- 벡터 DB: FAISS 로컬 인덱스
- 검색 결과를 프롬프트의 `### 관련 법리:` 블록에 삽입

```python
docs = vector_db.similarity_search(user_input, k=1)
prompt = f"### 사실관계:\n{user_input}\n\n### 관련 법리:\n{docs[0].page_content}\n\n### 결론:"
```

---

## Spring 백엔드 핵심

**WebClient + Resilience4j**

추론 서버가 죽거나 느려져도 Spring은 살아남도록 설계.

```java
@CircuitBreaker(name = "inference", fallbackMethod = "fallback")
@Retry(name = "inference")
public InferenceResponse infer(String fact) { ... }
```

**JPA 이력 영속화**

진단 한 건당 사실관계·조항·결론·응답시간을 `diagnosis_history`에 적재. 조항별 카운트를 `/history`에서 통계로 노출해 "실서비스다움" 확보.

**입력 검증**

```java
@NotBlank
@Size(min = 5, max = 2000, message = "사실관계는 5자 이상 2000자 이하로 입력해 주세요.")
private String fact;
```

---

## 실전 추론 테스트

학습에 사용되지 않은 사실관계 3건으로 진단 정확도를 검증했습니다.

| Case | 입력 사실관계 | Law-Lens 판단 |
|---|---|---|
| 1 | A사가 경영난을 이유로 대금 10%를 일방적으로 삭감함 | **제11조 위반** — 자금 사정의 악화는 대금 감액의 정당한 사유가 될 수 없음 |
| 2 | 하도급 계약서를 작업 시작 전까지 발급하지 않음 | **제3조 위반** — 모든 위탁 거래는 착수 전 서면 교부가 필수 의무사항 |
| 3 | B사의 기술 자료를 협의 없이 제3자에 유출함 | **제12조의3 위반** — 기술자료 유용은 징벌적 손해배상 대상인 중대 위반 |

---

## 측정 방법론

성능 수치의 측정 기준을 분리해서 명시합니다.

| 지표 | 데이터셋 | 측정 방법 |
|---|---|---|
| **Training Loss 0.1055** | 합성 학습 데이터 500건 | QLoRA SFT 학습 종료 시점 loss (W&B 트래킹) |
| **추론 성공률 94.8%** | 학습에 사용하지 않은 평가셋 200건 (`7_eval/eval_set.jsonl`) | article 일치율 (exact match). 한국어 일관성은 수동 라벨링 50건 표본 검증 |
| **환각 발생률 <1%** | 평가셋 200건 중 학습 외 조항·존재하지 않는 판례 인용 비율 | article 화이트리스트(`{제3조, 제11조, 제13조, 제12조의3}`) 미일치 응답 카운트 / 전체 응답 |

**평가셋 구성** (총 200건, seed 고정 재현 가능):
- 4개 학습 조항 각 35~39건 (`art3`, `art11`, `art13`, `art12_3`) — 학습 데이터와 어휘 분포를 다르게 작성
- Edge 30건 — 인사말·학술 질의·일반 문의 → `expected_article: null`
- Adversarial 20건 — 프롬프트 인젝션·시스템 프롬프트 탈취 시도 → `expected_article: null`
- 복합 위반(mix) 10건 — 두 조항 정보가 한 문장에 섞임, primary article만 라벨

생성기: `7_eval/generate_eval_set.py`. CI에서 임계치 미달 시 PR 차단.

---

## 운영 안정성

서비스 신뢰성·관측성·법률 도메인 컴플라이언스를 고려한 3가지 운영 장치를 적용했습니다.

**1. PII 마스킹 + 감사 로그 분리**
- 사실관계의 주민번호·사업자번호·휴대폰·계좌·금액을 정규식으로 마스킹 후 `diagnosis_history`에 적재
- 원본은 별도 `audit_log` 테이블에 AES-256-GCM 컬럼 암호화로 보관
- `@Scheduled` 보존 정책(기본 90일) 자동 삭제 — 개인정보보호법 대응

**2. Redis 응답 캐시 + Correlation ID**
- SHA-256(정규화 사실관계)을 키로 24h TTL 캐시 — 동일 요청 시 8B 추론 우회
- `lawlens.cache.hit` / `lawlens.cache.miss` 메트릭 Prometheus 노출
- `CorrelationIdFilter`가 `X-Request-Id`를 MDC에 주입, WebClient 필터로 FastAPI까지 전파
- FastAPI도 미들웨어로 동일 ID를 JSON 로그에 포함 → 한 요청을 양쪽에서 추적 가능

**3. Eval Set + GitHub Actions 회귀 테스트**
- 학습에 사용하지 않은 **200건** 검증 케이스 (4조항 각 35~39 + edge 30 + adversarial 20 + mix 10)
- `generate_eval_set.py`로 seed 고정 재현 가능 — **prompt injection 입력도 포함**
- PR 시 FastAPI 자동 기동 → `run_eval.py`가 article 일치율·P95 레이턴시 측정
- 정확도 임계치(85%) 또는 P95 예산(8s) 미달 시 CI fail + PR 코멘트로 리포트 자동 게시

**4. Article 화이트리스트 후처리**
- LLM이 학습 외 조항(`제999조` 등)을 반환하면 Spring `ArticleValidator`가 `null`로 강등
- accept/reject Prometheus 카운터로 환각률 실시간 트래킹
- FastAPI 측에도 동일 검증 — 양쪽에서 환각 차단

---

## 한계 및 다음 단계

PoC 단계에서 의도적으로 미루었거나, 운영 진입 시 손봐야 할 부분을 그대로 적습니다.

**학습·평가 데이터**
- 학습 데이터가 합성 500건으로 실제 사실관계의 어휘·문장 분포와 차이. → 공정위 의결서·판례 크롤링 + 실판례 기반 평가셋 구축이 다음 마일스톤.
- Eval set 200건도 통계적 유의성 한계. → 500~1,000건 + 변호사 라벨링 검수.

**개인정보·보안**
- PII 마스킹이 정규식 기반이라 자연어 PII(이름·회사명·주소)를 못 잡음. → Presidio 또는 KoNLPy + 사전 기반 NER 병행.
- 감사 로그 암호화 키가 환경변수 직접 주입. 운영에선 AWS KMS / HashiCorp Vault 데이터 키 봉투 암호화 + 키 로테이션 필요.

**모델·추론**
- 모델 버전 관리·점진 배포·자동 롤백 메커니즘 없음. → 어댑터 레지스트리 + canary 배포 구조 도입.
- 비동기 추론·SSE 진행 표시 미적용. CPU 추론 시 30초 타임아웃 한계.
- Backpressure(동시성 제한) 미적용. 트래픽 폭주 시 8B 모델 워커 OOM 가능 → Bulkhead 패턴 + 요청 큐.

**API·인증**
- API 인증·rate limiting 미적용. → Bucket4j + API 키 또는 OAuth2.
- API 버전 prefix(`/v1`) 미적용.

**운영 환경**
- DB 마이그레이션 도구 부재(`ddl-auto: update`). → Flyway + PostgreSQL.
- 분산 트레이싱 미적용. → OpenTelemetry로 Spring→FastAPI 구간 latency 분해.
- 토큰 사용량·비용 메트릭 미수집.

위 항목들은 "PoC에선 의도적으로 보류, 운영 진입 시 손볼 영역"으로 명시합니다. 면접에서 동일 질문 들어왔을 때 같은 답을 합니다.

---

## Result

- ML 추론 엔진(Python)과 서비스 백엔드(Spring)를 분리한 2-Tier 아키텍처 구현
- WebClient + Resilience4j로 추론 서버 장애를 격리, fallback 응답으로 가용성 확보
- 진단 이력을 JPA로 영속화하고 조항별 통계 페이지 제공
- 데이터 생성 → 벡터 DB 구축 → QLoRA 학습 → FastAPI 서빙 → Spring 연동까지 End-to-End 파이프라인 구축

## Insight

- LLM 서비스에서 데이터 흐름 설계가 사용자 경험에 직접적 영향을 준다는 점 확인
- 자유 텍스트보다 구조화된 출력이 서비스 확장성과 유지보수에 유리함을 확인
- ML 추론과 비즈니스 로직을 같은 런타임에 묶으면 장애 폭발 반경이 커진다는 점, 분리가 운영성에서 더 유리하다는 점 경험

---

## 빠른 실행

로컬에 **Java·Maven·Python 설치 불필요**. Docker만 있으면 됩니다.

```bash
# 1. 클론
git clone https://github.com/JHWwaI/law-lens-poc.git
cd law-lens-poc

# 2. AES 키 생성 후 .env에 채우기
cp .env.example .env
openssl rand -base64 32       # 결과를 LAWLENS_AUDIT_KEY에 붙여넣기

# 3-A. Mock 모드 (8B 모델 가중치 없이 풀스택 데모)
make up-mock
# 추론 컨테이너가 룰엔진으로 응답. 1분 내 부팅.

# 3-B. 풀 모드 (실제 LoRA 어댑터·FAISS 인덱스 필요)
make up
# 8B 모델 로드에 첫 부팅 5~10분 소요.

# 웹:    http://localhost:8080
# 추론:  http://localhost:8000/health
# 로그:  make logs
# 평가:  make eval
```

**Mock 모드**는 `5_inference_api/Dockerfile.mock` 기반 경량 이미지로, torch·transformers 없이 부팅합니다. 모델 가중치 없이도 면접관이 전체 스택을 시연할 수 있게 한 장치입니다.

### 호스트 직접 실행 (개발용)

Docker 없이 로컬에서 돌릴 수 있도록 런처 스크립트도 제공합니다.

```bash
# 추론 API (Mock)
5_inference_api/run.bat       # Windows
# 또는: LAWLENS_MOCK_MODE=1 uvicorn main:app --port 8000

# Spring 웹
6_spring_web/run.bat          # JAR 없으면 자동 빌드 후 실행
# 또는: java -jar target/law-lens-web-1.0.0.jar
```

전제: Python 3.11+, Java 17 (Temurin 기준 자동 탐지). Redis 미설치 시 캐시만 우회 — 다른 기능 정상 동작.

## 프로젝트 구조

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

## 기술스택

| | |
|---|---|
| 백엔드 | Spring Boot 3.3, Java 17, Spring Data JPA, Thymeleaf |
| 장애 처리 | Resilience4j (Retry, CircuitBreaker), Spring WebClient |
| DB | H2 (file mode) |
| 추론 서버 | FastAPI, Uvicorn, Docker |
| Base Model | beomi/Llama-3-Open-Ko-8B |
| 파인튜닝 | QLoRA (PEFT, TRL SFTTrainer) |
| 임베딩 | jhgan/ko-sroberta-multitask |
| 벡터 DB | FAISS (LangChain) |
| 학습 추적 | Weights & Biases |
| 인프라 | NVIDIA A100 / T4 |
