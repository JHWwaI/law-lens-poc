package com.widea.lawlens.service;

import com.widea.lawlens.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class AuditRetentionJob {

    private static final Logger log = LoggerFactory.getLogger(AuditRetentionJob.class);

    private final AuditLogRepository repository;

    @Value("${lawlens.audit.retention-days:90}")
    private int retentionDays;

    public AuditRetentionJob(AuditLogRepository repository) {
        this.repository = repository;
    }

    /** 매일 03:15 KST. 보존 기간 초과 감사 로그 삭제. */
    @Scheduled(cron = "0 15 3 * * *", zone = "Asia/Seoul")
    @Transactional
    public void purge() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(retentionDays);
        int removed = repository.deleteOlderThan(threshold);
        log.info("audit retention purge removed={} threshold={}", removed, threshold);
    }
}
