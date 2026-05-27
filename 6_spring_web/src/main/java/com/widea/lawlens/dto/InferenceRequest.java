package com.widea.lawlens.dto;

public class InferenceRequest {
    private String fact;
    private int top_k;

    public InferenceRequest() {}
    public InferenceRequest(String fact, int topK) {
        this.fact = fact;
        this.top_k = topK;
    }

    public String getFact() { return fact; }
    public void setFact(String fact) { this.fact = fact; }
    public int getTop_k() { return top_k; }
    public void setTop_k(int top_k) { this.top_k = top_k; }
}
