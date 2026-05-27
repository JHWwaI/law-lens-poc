# Law-Lens Web (Spring Boot)

Llama-3-Open-Ko-8B + QLoRA + FAISS RAG 추론 서비스를 호출해 하도급법 위반을 진단하는 Spring Boot 프런트엔드 + 백엔드입니다.

## 실행

```bash
# 1. 추론 서비스 먼저 기동
cd ../5_inference_api
uvicorn main:app --host 0.0.0.0 --port 8000

# 2. Spring Boot 기동
cd ../6_spring_web
./mvnw spring-boot:run
# → http://localhost:8080
```

## 구조

```
src/main/java/com/widea/lawlens/
├── LawLensApplication.java
├── config/
│   ├── InferenceProperties.java   # @ConfigurationProperties
│   └── WebClientConfig.java        # 타임아웃·커넥션 풀
├── controller/
│   └── DiagnoseController.java     # GET / · POST /diagnose · GET /history
├── service/
│   ├── DiagnoseService.java        # @Transactional 진단 + 이력 저장
│   └── InferenceClient.java        # WebClient + @Retry + @CircuitBreaker
├── domain/
│   └── DiagnosisHistory.java       # JPA Entity
├── repository/
│   └── DiagnosisHistoryRepository.java
└── dto/
    ├── DiagnoseRequest.java        # @Valid 입력 검증
    ├── InferenceRequest.java
    └── InferenceResponse.java

src/main/resources/
├── application.yml                 # H2 + WebClient + Resilience4j
├── templates/                      # Thymeleaf: layout/index/result/history
└── static/css/app.css
```

## 추론 서비스 연동

`application.yml`의 `lawlens.inference.base-url`로 FastAPI 위치 지정.
`InferenceClient`가 `WebClient`로 `POST /infer` 호출하고, Resilience4j Retry + CircuitBreaker로 장애 격리. 추론 서버가 죽어도 Spring은 fallback 응답으로 살아남습니다.

## DB

H2 파일 모드(`./data/lawlens.mv.db`). 진단 이력을 `diagnosis_history` 테이블에 적재하고, 조항별 카운트 통계를 `/history`에서 노출.

콘솔: http://localhost:8080/h2-console
