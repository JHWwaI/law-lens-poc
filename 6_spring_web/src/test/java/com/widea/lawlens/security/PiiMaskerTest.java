package com.widea.lawlens.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PiiMaskerTest {

    private final PiiMasker masker = new PiiMasker();

    @Test
    void masks_rrn_biz_phone_email() {
        String in = "홍길동(900101-1234567) 010-1234-5678, biz 123-45-67890, foo@bar.com";
        var r = masker.mask(in);
        assertThat(r.masked()).contains("[RRN]", "[PHONE]", "[BIZ]", "[EMAIL]");
        assertThat(r.hitCount()).isGreaterThanOrEqualTo(4);
    }

    @Test
    void masks_amount_in_krw() {
        var r = masker.mask("대금 3,000,000원을 미지급함");
        assertThat(r.masked()).contains("[AMOUNT]원").doesNotContain("3,000,000");
    }

    @Test
    void passthrough_when_no_pii() {
        var r = masker.mask("계약서를 작업 전 발급하지 않았다.");
        assertThat(r.masked()).isEqualTo("계약서를 작업 전 발급하지 않았다.");
        assertThat(r.hitCount()).isZero();
    }
}
