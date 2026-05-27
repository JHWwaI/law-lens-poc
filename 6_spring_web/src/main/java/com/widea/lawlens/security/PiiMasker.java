package com.widea.lawlens.security;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * 입력 사실관계에서 개인정보·식별정보를 마스킹한다.
 * 원본을 저장해야 하는 경우 {@link AuditLogEncryptor}로 별도 암호화 보관.
 */
@Component
public class PiiMasker {

    private static final Pattern RRN  = Pattern.compile("\\b\\d{6}[- ]?[1-4]\\d{6}\\b");
    private static final Pattern BIZ  = Pattern.compile("\\b\\d{3}[- ]?\\d{2}[- ]?\\d{5}\\b");
    private static final Pattern PHONE = Pattern.compile("\\b01[016789][- ]?\\d{3,4}[- ]?\\d{4}\\b");
    private static final Pattern TEL   = Pattern.compile("\\b0\\d{1,2}[- ]?\\d{3,4}[- ]?\\d{4}\\b");
    private static final Pattern EMAIL = Pattern.compile("\\b[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+\\b");
    private static final Pattern ACCOUNT = Pattern.compile("\\b\\d{2,6}[- ]\\d{2,6}[- ]\\d{2,8}\\b");
    private static final Pattern AMOUNT_KRW = Pattern.compile("([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{4,})\\s*원");

    public PiiMaskResult mask(String input) {
        if (input == null || input.isBlank()) {
            return new PiiMaskResult(input, 0);
        }
        int hits = 0;
        String s = input;

        s = replaceAll(s, RRN, "[RRN]"); hits += countHits(input, RRN);
        s = replaceAll(s, BIZ, "[BIZ]"); hits += countHits(input, BIZ);
        s = replaceAll(s, PHONE, "[PHONE]"); hits += countHits(input, PHONE);
        s = replaceAll(s, TEL, "[TEL]"); hits += countHits(input, TEL);
        s = replaceAll(s, EMAIL, "[EMAIL]"); hits += countHits(input, EMAIL);
        s = replaceAll(s, ACCOUNT, "[ACCT]"); hits += countHits(input, ACCOUNT);
        s = AMOUNT_KRW.matcher(s).replaceAll("[AMOUNT]원");

        return new PiiMaskResult(s, hits);
    }

    private static String replaceAll(String s, Pattern p, String token) {
        return p.matcher(s).replaceAll(token);
    }

    private static int countHits(String s, Pattern p) {
        var m = p.matcher(s);
        int c = 0;
        while (m.find()) c++;
        return c;
    }

    public record PiiMaskResult(String masked, int hitCount) {}
}
