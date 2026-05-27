package com.widea.lawlens.domain;

import com.widea.lawlens.security.AuditLogEncryptor;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 진단 요청의 원본 사실관계를 암호화 저장하는 감사 로그.
 * DiagnosisHistory(마스킹본)와 분리해 접근 제어·보존 정책을 별도로 관리.
 */
@Entity
@Table(name = "audit_log", indexes = {
        @Index(name = "idx_audit_created", columnList = "createdAt"),
        @Index(name = "idx_audit_request", columnList = "requestId")
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String requestId;

    @Column(length = 64)
    private String clientIp;

    @Convert(converter = AuditLogEncryptor.class)
    @Lob
    @Column(nullable = false)
    private String originalFact;

    private int piiHitCount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() { this.createdAt = LocalDateTime.now(); }

    public static AuditLog of(String requestId, String clientIp, String originalFact, int piiHitCount) {
        AuditLog a = new AuditLog();
        a.requestId = requestId;
        a.clientIp = clientIp;
        a.originalFact = originalFact;
        a.piiHitCount = piiHitCount;
        return a;
    }

    public Long getId() { return id; }
    public String getRequestId() { return requestId; }
    public String getClientIp() { return clientIp; }
    public String getOriginalFact() { return originalFact; }
    public int getPiiHitCount() { return piiHitCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
