<div align="center">

# Subcontract Risk Detector

**Law-Lens AI — 하도급법 위반 실시간 진단 서비스**

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=flat-square&logo=springboot&logoColor=white)](.)
[![Java](https://img.shields.io/badge/Java-17-007396?style=flat-square&logo=openjdk&logoColor=white)](.)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](.)
[![Llama-3-Ko](https://img.shields.io/badge/Llama--3--Open--Ko--8B-FF6B00?style=flat-square&logo=meta&logoColor=white)](.)
[![QLoRA](https://img.shields.io/badge/QLoRA-9B59B6?style=flat-square)](.)
[![FAISS](https://img.shields.io/badge/FAISS_RAG-005571?style=flat-square)](.)

</div>

하도급 거래 사실관계를 입력하면 **위반 의심 조항·법리 근거·상세 사유**를 분석해주는 웹 서비스. Llama-3-Open-Ko-8B를 QLoRA로 파인튜닝하고 FAISS RAG를 결합한 추론 엔진을 **Spring + FastAPI 2-Tier**로 분리했습니다.

> 교육과제로 시작해 운영 관점의 안전장치(PII 마스킹·캐시·회귀 평가·환각 차단)를 적용한 PoC입니다. 범용 법률 질의로 확장한 버전: [Legal AI Assistant](https://github.com/JHWwaI/legal-ai-assistant).

---

## 아키텍처

```
[브라우저]
   │
   ▼
[Spring Boot 3.3]  ─── JPA(H2) · Redis · Resilience4j
   │ WebClient
   ▼
[FastAPI]          ─── Llama-3-Open-Ko-8B + QLoRA + FAISS RAG
```

| | Spring (Java) | FastAPI (Python) |
|---|---|---|
| 담당 | UI · 이력 · 검증 · 캐시 · 장애 격리 | LLM 추론 · RAG 검색 |
| 분리 이유 | 8B 모델을 Java에 끼울 수 없고, 둘의 장애 폭발 반경을 분리 |||

---

## 성능

| 지표 | 값 | 측정 방법 |
|---|---|---|
| Training Loss | **3.1973 → 0.1055** (−96.7%) | QLoRA SFT 학습 종료 시점 (W&B) |
| 추론 성공률 | **94.8%** | 학습 외 평가셋 200건 article 일치율 |
| 환각 발생률 | **<1%** | 화이트리스트 미일치 / 전체 응답 |

**모델 설정**: `beomi/Llama-3-Open-Ko-8B` + QLoRA(4-bit, r=16, α=32). 학습 데이터는 4개 조항(제3·11·13·12조의3) 합성 시나리오 500건.

---

## 핵심 기능

- **QLoRA 파인튜닝** — 4-bit 양자화로 8B 모델을 일반 GPU에서 학습
- **FAISS RAG** — `jhgan/ko-sroberta-multitask` 임베딩으로 학습 외 사실관계도 법리 매칭
- **PII 마스킹 + 감사 로그** — 정규식 마스킹 후 적재, 원본은 AES-256-GCM 컬럼 암호화 + 90일 보존
- **Redis 응답 캐시** — SHA-256 키, 24h TTL, hit/miss 메트릭
- **Correlation ID** — Spring MDC → WebClient → FastAPI까지 X-Request-Id 전파
- **Article 화이트리스트** — 학습 외 조항 응답을 환각으로 차단, accept/reject 카운터 노출
- **Resilience4j** — WebClient + Retry + CircuitBreaker + fallback
- **회귀 평가 CI** — PR마다 평가셋 200건 자동 실행, 임계치 미달 시 차단

---

## 실전 추론 테스트

| 입력 사실관계 | Law-Lens 판단 |
|---|---|
| A사가 경영난을 이유로 대금 10%를 일방적으로 삭감함 | **제11조** — 자금 사정 악화는 정당한 사유 아님 |
| 하도급 계약서를 작업 시작 전까지 발급하지 않음 | **제3조** — 착수 전 서면 교부는 필수 의무 |
| B사의 기술 자료를 협의 없이 제3자에 유출함 | **제12조의3** — 기술자료 유용은 징벌적 손해배상 대상 |

---

## Quickstart

```bash
git clone https://github.com/JHWwaI/law-lens-poc.git
cd law-lens-poc

cp .env.example .env
# .env의 LAWLENS_AUDIT_KEY를 'openssl rand -base64 32' 결과로 교체

make up-mock     # 가중치 없이 풀스택 데모 (1분)
# 또는 make up   # 실제 모델 로드 (5~10분)

# 웹: http://localhost:8080
# 추론: http://localhost:8000/health
# 평가: make eval
```

호스트에서 직접 띄우려면: `5_inference_api/run.bat` + `6_spring_web/run.bat` (Java 17, Python 3.11 필요).

---

## 프로젝트 구조

```
.
├── 1_data_pipeline/   합성 데이터 500건 생성
├── 2_vector_db/       FAISS 인덱스
├── 3_fine_tuning/     QLoRA 학습 + 어댑터
├── 5_inference_api/   FastAPI 추론 서비스 (+ Mock 모드)
├── 6_spring_web/      Spring Boot + JPA + Redis + PII 마스킹
├── 7_eval/            평가셋 200건 + run_eval.py
├── docker-compose.yml + Makefile + .env.example
└── .github/workflows/ PR 회귀 평가
```

---

## 한계 (PoC 단계 보류 항목)

- 합성 데이터 학습 → 실판례 기반 데이터 보강 필요
- 정규식 PII 마스킹 → NER 기반(Presidio·KoNLPy) 보강 필요
- 환경변수 키 관리 → KMS/Vault + 키 로테이션 필요
- H2 + ddl-auto → Postgres + Flyway 필요
- 인증·rate limiting·OpenTelemetry 미적용

> 면접에서 동일 질문 받았을 때 같은 답을 합니다. "운영 진입 시 손볼 영역"으로 명시.

---

## Result · Insight

- ML 추론과 비즈니스 로직을 분리하면 장애 폭발 반경이 줄어들지만 네트워크 홉·디버깅 복잡도가 늘어남 — 트레이드오프 명확히 인지
- 자유 텍스트 LLM 응답을 화이트리스트·스키마로 후처리해야 운영 가능한 수준이 됨
- 합성 데이터의 일반화 한계는 RAG로 일부 보완 가능, 다만 어휘 분포 격차는 여전히 평가셋에서 드러남

---

## 기술스택

**백엔드**: Spring Boot 3.3 · Java 17 · Spring Data JPA · Thymeleaf · Resilience4j · WebClient · H2
**추론**: FastAPI · Uvicorn · Docker
**모델**: `beomi/Llama-3-Open-Ko-8B` · QLoRA (PEFT, TRL) · FAISS · `jhgan/ko-sroberta-multitask`
**관측**: Micrometer · Prometheus · Logback JSON · Correlation ID
**학습 추적**: Weights & Biases · NVIDIA A100 / T4
