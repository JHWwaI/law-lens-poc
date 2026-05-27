package com.widea.lawlens.repository;

import com.widea.lawlens.domain.DiagnosisHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiagnosisHistoryRepository extends JpaRepository<DiagnosisHistory, Long> {
    Page<DiagnosisHistory> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByArticle(String article);
}
