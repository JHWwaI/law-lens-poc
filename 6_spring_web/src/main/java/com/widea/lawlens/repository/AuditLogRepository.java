package com.widea.lawlens.repository;

import com.widea.lawlens.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Modifying
    @Query("delete from AuditLog a where a.createdAt < :threshold")
    int deleteOlderThan(@Param("threshold") LocalDateTime threshold);
}
