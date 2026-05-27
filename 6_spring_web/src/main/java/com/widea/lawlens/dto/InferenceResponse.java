package com.widea.lawlens.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class InferenceResponse {
    private String article;
    private String conclusion;
    @JsonProperty("retrieved_rule")
    private String retrievedRule;
    @JsonProperty("latency_ms")
    private int latencyMs;

    public String getArticle() { return article; }
    public void setArticle(String article) { this.article = article; }
    public String getConclusion() { return conclusion; }
    public void setConclusion(String conclusion) { this.conclusion = conclusion; }
    public String getRetrievedRule() { return retrievedRule; }
    public void setRetrievedRule(String retrievedRule) { this.retrievedRule = retrievedRule; }
    public int getLatencyMs() { return latencyMs; }
    public void setLatencyMs(int latencyMs) { this.latencyMs = latencyMs; }
}
