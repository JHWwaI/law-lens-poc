package com.widea.lawlens.service;

import com.widea.lawlens.dto.InferenceResponse;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Optional;

@Component
public class InferenceCache {

    private static final Logger log = LoggerFactory.getLogger(InferenceCache.class);
    private static final String PREFIX = "lawlens:infer:";

    private final RedisTemplate<String, InferenceResponse> redis;
    private final Counter hitCounter;
    private final Counter missCounter;

    @Value("${lawlens.cache.ttl-hours:24}")
    private long ttlHours;

    @Value("${lawlens.cache.enabled:true}")
    private boolean enabled;

    public InferenceCache(RedisTemplate<String, InferenceResponse> redis, MeterRegistry registry) {
        this.redis = redis;
        this.hitCounter = Counter.builder("lawlens.cache.hit").register(registry);
        this.missCounter = Counter.builder("lawlens.cache.miss").register(registry);
    }

    public Optional<InferenceResponse> get(String fact) {
        if (!enabled) return Optional.empty();
        try {
            String key = key(fact);
            InferenceResponse hit = redis.opsForValue().get(key);
            if (hit != null) {
                hitCounter.increment();
                log.debug("cache hit key={}", key);
                return Optional.of(hit);
            }
            missCounter.increment();
            return Optional.empty();
        } catch (Exception e) {
            log.warn("cache get failed, bypassing: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public void put(String fact, InferenceResponse response) {
        if (!enabled) return;
        try {
            redis.opsForValue().set(key(fact), response, Duration.ofHours(ttlHours));
        } catch (Exception e) {
            log.warn("cache put failed, skipping: {}", e.getMessage());
        }
    }

    /** 공백·줄바꿈 차이로 중복 미스 안 나게 정규화 후 SHA-256. */
    private static String key(String fact) {
        String normalized = fact.replaceAll("\\s+", " ").trim();
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(normalized.getBytes(StandardCharsets.UTF_8));
            return PREFIX + HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
