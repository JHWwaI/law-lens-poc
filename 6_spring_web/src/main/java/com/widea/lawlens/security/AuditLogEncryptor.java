package com.widea.lawlens.security;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES-256-GCM column encryption. 운영 환경에서는 키를 KMS·Vault에서 주입.
 */
@Component
@Converter
public class AuditLogEncryptor implements AttributeConverter<String, String> {

    private static final String ALG = "AES/GCM/NoPadding";
    private static final int IV_LEN = 12;
    private static final int TAG_LEN = 128;

    @Value("${lawlens.audit.encryption-key-base64:}")
    private String keyBase64;

    private SecretKeySpec key;

    private SecretKeySpec key() {
        if (key == null) {
            byte[] raw = keyBase64 == null || keyBase64.isBlank()
                    ? new byte[32]
                    : Base64.getDecoder().decode(keyBase64);
            if (raw.length != 32) {
                throw new IllegalStateException("lawlens.audit.encryption-key-base64 must decode to 32 bytes");
            }
            key = new SecretKeySpec(raw, "AES");
        }
        return key;
    }

    @Override
    public String convertToDatabaseColumn(String plain) {
        if (plain == null) return null;
        try {
            byte[] iv = new byte[IV_LEN];
            new SecureRandom().nextBytes(iv);
            Cipher c = Cipher.getInstance(ALG);
            c.init(Cipher.ENCRYPT_MODE, key(), new GCMParameterSpec(TAG_LEN, iv));
            byte[] ct = c.doFinal(plain.getBytes());
            return Base64.getEncoder().encodeToString(ByteBuffer.allocate(iv.length + ct.length).put(iv).put(ct).array());
        } catch (Exception e) {
            throw new IllegalStateException("encryption failed", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbValue) {
        if (dbValue == null) return null;
        try {
            byte[] all = Base64.getDecoder().decode(dbValue);
            byte[] iv = new byte[IV_LEN];
            byte[] ct = new byte[all.length - IV_LEN];
            System.arraycopy(all, 0, iv, 0, IV_LEN);
            System.arraycopy(all, IV_LEN, ct, 0, ct.length);
            Cipher c = Cipher.getInstance(ALG);
            c.init(Cipher.DECRYPT_MODE, key(), new GCMParameterSpec(TAG_LEN, iv));
            return new String(c.doFinal(ct));
        } catch (Exception e) {
            throw new IllegalStateException("decryption failed", e);
        }
    }
}
