package com.widea.lawlens.service;

import com.widea.lawlens.domain.AuditLog;
import com.widea.lawlens.domain.DiagnosisHistory;
import com.widea.lawlens.dto.InferenceResponse;
import com.widea.lawlens.repository.AuditLogRepository;
import com.widea.lawlens.repository.DiagnosisHistoryRepository;
import com.widea.lawlens.security.PiiMasker;
import com.widea.lawlens.web.CorrelationIdHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiagnoseService {

    private static final Logger log = LoggerFactory.getLogger(DiagnoseService.class);

    private final InferenceClient inferenceClient;
    private final InferenceCache cache;
    private final DiagnosisHistoryRepository historyRepo;
    private final AuditLogRepository auditRepo;
    private final PiiMasker masker;
    private final ArticleValidator articleValidator;

    public DiagnoseService(InferenceClient inferenceClient,
                           InferenceCache cache,
                           DiagnosisHistoryRepository historyRepo,
                           AuditLogRepository auditRepo,
                           PiiMasker masker,
                           ArticleValidator articleValidator) {
        this.inferenceClient = inferenceClient;
        this.cache = cache;
        this.historyRepo = historyRepo;
        this.auditRepo = auditRepo;
        this.masker = masker;
        this.articleValidator = articleValidator;
    }

    @Transactional
    public DiagnosisHistory diagnose(String fact, String clientIp) {
        String requestId = CorrelationIdHolder.get();

        // 1. 원본은 감사 로그에만 암호화 보관
        var maskResult = masker.mask(fact);
        auditRepo.save(AuditLog.of(requestId, clientIp, fact, maskResult.hitCount()));

        // 2. 추론·이력에는 마스킹본만 사용
        String maskedFact = maskResult.masked();

        InferenceResponse resp = cache.get(maskedFact).orElseGet(() -> {
            InferenceResponse fresh = inferenceClient.infer(maskedFact);
            cache.put(maskedFact, fresh);
            return fresh;
        });

        String validatedArticle = articleValidator.validate(resp.getArticle());
        log.info("diagnose request_id={} pii_hits={} article_raw={} article={} latency_ms={}",
                requestId, maskResult.hitCount(), resp.getArticle(), validatedArticle, resp.getLatencyMs());

        return historyRepo.save(DiagnosisHistory.of(
                maskedFact,
                validatedArticle,
                resp.getConclusion(),
                resp.getRetrievedRule(),
                resp.getLatencyMs()
        ));
    }
}
