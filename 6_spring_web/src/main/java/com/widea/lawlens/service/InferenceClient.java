package com.widea.lawlens.service;

import com.widea.lawlens.dto.InferenceRequest;
import com.widea.lawlens.dto.InferenceResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;

@Component
public class InferenceClient {

    private static final Logger log = LoggerFactory.getLogger(InferenceClient.class);
    private final WebClient webClient;

    public InferenceClient(WebClient inferenceWebClient) {
        this.webClient = inferenceWebClient;
    }

    @CircuitBreaker(name = "inference", fallbackMethod = "fallback")
    @Retry(name = "inference")
    public InferenceResponse infer(String fact) {
        try {
            return webClient.post()
                    .uri("/infer")
                    .bodyValue(new InferenceRequest(fact, 1))
                    .retrieve()
                    .bodyToMono(InferenceResponse.class)
                    .block(Duration.ofSeconds(30));
        } catch (WebClientResponseException e) {
            log.error("Inference API error: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        }
    }

    @SuppressWarnings("unused")
    private InferenceResponse fallback(String fact, Throwable t) {
        log.warn("Inference fallback triggered: {}", t.getMessage());
        InferenceResponse r = new InferenceResponse();
        r.setArticle(null);
        r.setConclusion("추론 서버에 일시적으로 접근할 수 없습니다. 잠시 후 다시 시도해 주세요.");
        r.setRetrievedRule("");
        r.setLatencyMs(0);
        return r;
    }
}
