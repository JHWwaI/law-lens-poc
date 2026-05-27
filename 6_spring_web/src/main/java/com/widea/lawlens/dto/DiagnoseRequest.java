package com.widea.lawlens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DiagnoseRequest {

    @NotBlank
    @Size(min = 5, max = 2000, message = "사실관계는 5자 이상 2000자 이하로 입력해 주세요.")
    private String fact;

    public DiagnoseRequest() {}

    public String getFact() { return fact; }
    public void setFact(String fact) { this.fact = fact; }
}
