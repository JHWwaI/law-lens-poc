# Law-Lens — 하도급법 위반 AI 진단 PoC

> **하도급 거래 사실관계를 입력하면, 도메인 파인튜닝(QLoRA)된 한국어 LLM + FAISS RAG가 위반 의심 조항(제3조 · 제11조 · 제13조 · 제12조의3)과 법리 근거를 진단하는 2-Tier 서비스**

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F) ![Java](https://img.shields.io/badge/Java-17-orange) ![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688) ![Model](https://img.shields.io/badge/Llama--3--Open--Ko--8B-QLoRA_4bit-purple) ![RAG](https://img.shields.io/badge/FAISS-ko--sroberta-blue) ![CI](https://img.shields.io/badge/CI-%EC%A0%95%ED%99%95%EB%8F%84_%E2%89%A50.85_%EA%B2%8C%EC%9D%B4%ED%8A%B8-success)

**📊 성능** (자체 평가셋, W&B 기록 기준): Training Loss **3.20 → 0.11 (−96.7%)** · 추론 성공률 **94.8%** · 환각률 **<1%** (화이트리스트 검증 기준)

---

## 🏗 아키텍처 & 기술 스택

```
Browser ── Thymeleaf
   ▼
Spring Boot 3.3 (Java 17) :8080          ← 웹/이력/캐시/감사 계층
   ├── PiiMasker (정규식 7종: 주민·사업자·전화·이메일·계좌·금액)
   ├── Redis 캐시 (TTL 24h) + Resilience4j (CB 50% / retry 3)
   ├── AuditLog 암호화 보관 (보존 90일)
   ▼  WebClient (timeout 15s, X-Request-Id 전파)
FastAPI :8000                             ← 추론 계층
   ├── Llama-3-Open-Ko-8B + QLoRA 어댑터 (4bit, r=16, α=32)
   ├── FAISS RAG (jhgan/ko-sroberta-multitask)
   └── 조항 화이트리스트 검증 → 환각 차단
Docker Compose (redis:7 + inference + web, healthcheck 기반 기동 순서)
```

**기술 선택 이유**

- **2-Tier 분리**: GPU 추론(수분 로드, 무거움)과 웹 트랜잭션(가볍고 빠름)의 생애주기가 달라 장애 격리·독립 스케일링을 위해 분리
- **QLoRA 4-bit**: 8B 모델을 단일 소비자 GPU에서 파인튜닝하기 위한 선택 (r=16, target: q_proj/v_proj)
- **FAISS RAG 결합**: 파인튜닝만으로 부족한 법조문 정확성을 검색 근거로 보강
- **Resilience4j + Redis**: 추론 서버 장애 시 회로 차단, 동일 질의 24h 캐시로 GPU 비용 절감

## ⭐ 핵심 기여 및 성과 (STAR)

### 1. 법률 도메인 LLM 파인튜닝 — Loss 96.7% 감소
- **Task**: 범용 한국어 LLM은 하도급법 조항을 빈번히 혼동·날조
- **Action**: 4개 조항 시나리오 기반 **합성 학습 데이터 500건** 파이프라인 구축 → `beomi/Llama-3-Open-Ko-8B`를 QLoRA(4-bit, max_seq 1024)로 파인튜닝, W&B로 실험 추적
- **Result**: Training Loss **3.1973 → 0.1055**, 평가셋 추론 성공률 **94.8%**

### 2. 환각(Hallucination) 구조적 차단 — 환각률 <1%
- **Task**: LLM이 존재하지 않는 조항을 인용하는 법률 서비스 치명 리스크
- **Action**: 학습 범위 4개 조항을 **화이트리스트**로 고정, 정규식으로 응답에서 조항 추출 후 미일치 시 `article=null` 처리 + reject 카운터 로깅. Spring 측 `ArticleValidator`로 **이중 검증**
- **Result**: 허용 외 조항 인용을 응답 단계에서 100% 차단, 환각률 **<1%** 달성

### 3. PR마다 모델 품질을 막는 회귀 평가 CI
- **Task**: 프롬프트/모델 변경이 기존 정확도를 조용히 망가뜨리는 문제
- **Action**: GitHub Actions에서 PR마다 평가셋 전체 실행 → **정확도 ≥ 0.85, p95 ≤ 8초** 미달 시 머지 차단 + 결과 PR 코멘트 자동 게시. GPU 없는 CI를 위해 **Mock 모드**(룰엔진 대체, heavy import lazy 로딩) 설계
- **Result**: 모델 품질이 코드 리뷰처럼 **자동 게이트**로 관리되는 MLOps 체계 구축

### 4. PII 보호 설계 — 마스킹 후 추론, 원본은 암호화 감사 로그만
- **Action**: 정규식 7종으로 주민번호·계좌 등 마스킹 → **마스킹본만 캐시 키·추론·이력에 사용**, 원본은 AES 암호화 감사 로그(90일)에만 보관. 암호화 키 미설정 시 컨테이너 기동 자체를 차단(`:?required`)
- **Result**: 민감정보가 모델/캐시로 유출되는 경로를 설계 단계에서 제거

## 🔧 Troubleshooting

**1. 8B 모델 로드 중 healthcheck 조기 실패로 컨테이너 재시작 루프**
- 원인: 모델 로드에 수 분 소요 → Docker healthcheck가 기동 전 실패 판정
- 해결: `start_period: 600s` 설정 + web 컨테이너는 `depends_on: condition: service_healthy`로 기동 순서 보장

**2. GPU 없는 환경에서 통합 테스트 불가**
- 원인: torch/모델 가중치 없이는 스택 부팅조차 안 됨 → CI·데모 막힘
- 해결: `LAWLENS_MOCK_MODE=1` 시 모델 로드를 건너뛰고 키워드 룰엔진으로 응답하는 Mock 모드 구현, heavy import를 lazy로 이동 → **1분 내 전체 스택 기동**(`make up-mock`)

## 🚀 Quick Start

```bash
make up-mock   # GPU 불필요, ~1분 (웹 :8080, 추론 :8000)
make up        # 실제 8B 모델, 5~10분
```

## ⚠️ PoC 한계 (의도적 보류)

- 합성 데이터 → 실판례 확장 예정 · 정규식 PII → NER(Presidio) 고도화 · H2 → Postgres+Flyway · 인증/OTel 미적용
- 확장 버전: [JHWwaI/legal-ai-assistant](https://github.com/JHWwaI/legal-ai-assistant)
