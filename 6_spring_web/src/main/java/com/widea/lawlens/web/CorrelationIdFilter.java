package com.widea.lawlens.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String id = req.getHeader(CorrelationIdHolder.HEADER);
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
        MDC.put(CorrelationIdHolder.MDC_KEY, id);
        res.setHeader(CorrelationIdHolder.HEADER, id);
        try {
            chain.doFilter(req, res);
        } finally {
            MDC.remove(CorrelationIdHolder.MDC_KEY);
        }
    }
}
