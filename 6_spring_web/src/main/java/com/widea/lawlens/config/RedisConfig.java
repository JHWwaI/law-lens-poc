package com.widea.lawlens.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.widea.lawlens.dto.InferenceResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, InferenceResponse> inferenceRedisTemplate(
            RedisConnectionFactory cf, ObjectMapper objectMapper) {
        RedisTemplate<String, InferenceResponse> t = new RedisTemplate<>();
        t.setConnectionFactory(cf);
        t.setKeySerializer(new StringRedisSerializer());
        Jackson2JsonRedisSerializer<InferenceResponse> ser =
                new Jackson2JsonRedisSerializer<>(objectMapper, InferenceResponse.class);
        t.setValueSerializer(ser);
        t.setHashKeySerializer(new StringRedisSerializer());
        t.setHashValueSerializer(ser);
        t.afterPropertiesSet();
        return t;
    }
}
