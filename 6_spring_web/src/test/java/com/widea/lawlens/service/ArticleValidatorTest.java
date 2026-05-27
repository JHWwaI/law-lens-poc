package com.widea.lawlens.service;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class ArticleValidatorTest {

    private final ArticleValidator validator = new ArticleValidator(new SimpleMeterRegistry());

    @ParameterizedTest
    @ValueSource(strings = {"제3조", "제11조", "제13조", "제12조의3", "제 11 조", "제11조 "})
    void accepts_known_articles(String input) {
        assertThat(validator.validate(input)).isNotNull();
    }

    @ParameterizedTest
    @ValueSource(strings = {"제999조", "제5조", "Article 11", "위반입니다", " "})
    void rejects_unknown_or_garbage(String input) {
        assertThat(validator.validate(input)).isNull();
    }

    @Test
    void null_input_returns_null() {
        assertThat(validator.validate(null)).isNull();
    }
}
