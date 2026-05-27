package com.widea.lawlens.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_history", indexes = {
        @Index(name = "idx_created_at", columnList = "createdAt")
})
public class DiagnosisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(nullable = false)
    private String fact;

    @Column(length = 32)
    private String article;

    @Lob
    private String conclusion;

    @Lob
    private String retrievedRule;

    private int latencyMs;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() { this.createdAt = LocalDateTime.now(); }

    public static DiagnosisHistory of(String fact, String article, String conclusion,
                                      String retrievedRule, int latencyMs) {
        DiagnosisHistory h = new DiagnosisHistory();
        h.fact = fact;
        h.article = article;
        h.conclusion = conclusion;
        h.retrievedRule = retrievedRule;
        h.latencyMs = latencyMs;
        return h;
    }

    public Long getId() { return id; }
    public String getFact() { return fact; }
    public String getArticle() { return article; }
    public String getConclusion() { return conclusion; }
    public String getRetrievedRule() { return retrievedRule; }
    public int getLatencyMs() { return latencyMs; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
