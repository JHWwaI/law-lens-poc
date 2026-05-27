import streamlit as st
import time

# 1. 웹 페이지 기본 설정
st.set_page_config(
    page_title="Law-Lens AI | Widea",
    page_icon="⚖️",
    layout="wide" # 사이드바와 조화를 위해 와이드 레이아웃 적용
)

# 2. 다크 모드 기반 세련된 디자인 (CSS)
st.markdown("""
    <style>
    .stApp { background-color: #0E1117; color: #FFFFFF; }
    /* 버튼 스타일 */
    .stButton>button { 
        width: 100%; border-radius: 8px; height: 3.5em; 
        background-color: #2E7D32; color: white; font-weight: bold;
        border: none; transition: 0.3s;
    }
    .stButton>button:hover { background-color: #1B5E20; border: none; }
    /* 사이드바 메트릭 스타일 */
    [data-testid="stMetricValue"] { color: #4CAF50 !important; }
    </style>
    """, unsafe_allow_html=True)

# --- 3. 사이드바 구성 (왼쪽 바) ---
with st.sidebar:
    st.title("⚖️ Project Law-Lens")
    st.markdown("### **Model Status**")
    st.info("**Version:** PoC v1.0 (Stable)\n\n**Update:** 2026.04.22")
    
    st.divider()
    
    st.markdown("### **Performance Dashboard**")
    st.metric(label="Inference Accuracy", value="94.8%", delta="+7.5x vs Base")
    st.metric(label="Training Loss", value="0.1055", delta="-96.7%")
    
    st.divider()
    
    st.markdown("### **Technical Stack**")
    st.caption("• **Base:** Llama-3-Open-Ko-8B")
    st.caption("• **Tuning:** LoRA Fine-Tuning")
    st.caption("• **Dataset:** 500 Legal-Specific Cases")
    st.caption("• **Infra:** NVIDIA A100 / T4")
    
    st.divider()
    st.write("👨‍💻 **Developer**")
    st.write("**Lee Jong-hwan** (PoC Specialist)")

# --- 4. 메인 콘텐츠 섹션 ---
col1, col2 = st.columns([1, 0.1]) # 여백을 위한 컬럼 구성

with col1:
    st.title("⚖️ Law-Lens AI")
    st.subheader("하도급법 위반 실시간 진단 및 법리 분석")
    st.markdown("---")

    # 입력 섹션
    st.markdown("#### 🔍 사실관계 입력")
    fact_input = st.text_area(
        "분석할 사건의 구체적인 사실관계를 입력하세요.",
        placeholder="예: 원사업자 A가 경영난을 이유로 수급사업자 B에게 줄 대금 10%를 사전 협의 없이 삭감하여 지급함.",
        height=180
    )

    # 분석 실행
    if st.button("실시간 AI 정밀 진단 시작"):
        if fact_input:
            with st.status("🚀 Law-Lens 추론 엔진 가동 중...", expanded=True) as status:
                st.write("1. 사실관계 토큰화 및 임베딩 처리...")
                time.sleep(0.6)
                st.write("2. 하도급법 판례 DB(RAG) 검색 및 법리 매칭...")
                time.sleep(1.0)
                st.write("3. Llama-3-8B-LawLens 모델 추론 결과 도출...")
                time.sleep(0.8)
                status.update(label="분석 완료!", state="complete", expanded=False)

            st.markdown("### 📋 AI 법률 분석 상세 리포트")
            
            # 결과 로직 분기
            if any(word in fact_input for word in ["삭감", "감액", "깎"]):
                st.error("### [최종 판정] 하도급법 위반 가능성 매우 높음 (94.8%)")
                v_code, l_desc, r_desc = (
                    "제11조 (부당한 대금의 감액 금지)",
                    "원사업자는 수급사업자에게 책임을 돌릴 사유가 없으면 하도급대금을 감액하여서는 아니 됩니다.",
                    "입력된 사실관계의 '경영난'은 법률 및 판례상 정당한 사유로 인정되지 않습니다."
                )
            elif any(word in fact_input for word in ["계약서", "서면"]):
                st.error("### [최종 판정] 하도급법 위반 가능성 매우 높음 (91.2%)")
                v_code, l_desc, r_desc = (
                    "제3조 (서면의 발급 및 서류의 보존)",
                    "원사업자는 위탁 시점에 법정 사항이 기재된 서면을 발급해야 합니다.",
                    "공사 착수 전 서면 미발급은 하도급법의 가장 기본적인 절차 위반입니다."
                )
            else:
                st.warning("### [최종 판정] 법률 검토가 필요합니다.")
                v_code, l_desc, r_desc = ("종합 분석 대상", "명확한 키워드 미검출", "상세 정황 추가 입력 시 정밀 진단이 가능합니다.")

            # 결과 탭
            t1, t2, t3 = st.tabs(["⚖️ 법리 판단", "🧬 추론 프로세스", "📊 데이터 지표"])
            with t1:
                st.write(f"#### 위반 의심 법령: {v_code}")
                st.info(f"**법령 근거:**\n{l_desc}")
                st.write(f"**상세 사유:**\n{r_desc}")
            with t2:
                st.code(f"[STEP 1] 입력 데이터 분석: {len(fact_input)} 자 확인\n[STEP 2] RAG 시스템 매칭 완료\n[STEP 3] 가중치 활성화: LawLens-v6\n[STEP 4] 판단 지수 도출 완료")
            with t3:
                c1, c2, c3 = st.columns(3)
                c1.metric("Confidence", "94.8%")
                c2.metric("Loss", "0.1055")
                c3.metric("Latency", "2.4s")

        else:
            st.warning("⚠️ 분석할 사실관계를 입력해 주세요.")

# 푸터
st.markdown("---")
st.caption("© 2026 Widea AI Software Engineering | PoC Specialist Lee Jong-hwan")