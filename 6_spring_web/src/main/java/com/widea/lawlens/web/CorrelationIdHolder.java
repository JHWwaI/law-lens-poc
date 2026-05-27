package com.widea.lawlens.web;

import org.slf4j.MDC;

public final class CorrelationIdHolder {

    public static final String HEADER = "X-Request-Id";
    public static final String MDC_KEY = "requestId";

    private CorrelationIdHolder() {}

    public static String get() {
        String v = MDC.get(MDC_KEY);
        return v != null ? v : "-";
    }
}
