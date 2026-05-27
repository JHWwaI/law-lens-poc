package com.widea.lawlens.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * LLM이 반환한 article 문자열이 학습된 4개 조항 안에 들어가는지 검증한다.
 * 학습 외 조항(예: 제999조)·환각·포맷 깨짐을 후처리에서 차단.
 */
@Component
public class ArticleValidator {

    private static final Logger log = LoggerFactory.getLogger(ArticleValidator.class);

    public static final Set<String> ALLOWED = Set.of(
            "제3조", "제11조", "제13조", "제12조의3"
    );

    private final Counter rejectCounter;
    private final Counter acceptCounter;

    public ArticleValidator(MeterRegistry registry) {
        this.acceptCounter = Counter.builder("lawlens.article.accept").register(registry);
        this.rejectCounter = Counter.builder("lawlens.article.reject").register(registry);
    }

    /**
     * @return 허용된 조항이면 그대로, 아니면 null (환각으로 간주).
     */
    public String validate(String article) {
        if (article == null || article.isBlank()) {
            return null;
        }
        String normalized = article.replaceAll("\\s", "");
        if (ALLOWED.contains(normalized)) {
            acceptCounter.increment();
            return normalized;
        }
        log.warn("article rejected (not in whitelist): {}", article);
        rejectCounter.increment();
        return null;
    }
}
