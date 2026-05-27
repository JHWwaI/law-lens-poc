import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# 1. 환경 세팅
BASE_MODEL = "beomi/Llama-3-Open-Ko-8B"
ADAPTER_PATH = "../3_fine_tuning/law_model_adapter" # 방금 다운로드한 폴더 경로
DB_PATH = "../data/faiss_index"

print("🧠 모델과 지식 DB를 로드 중입니다... (CPU 모드)")
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
# 가중치 결합 (Base + Adapter)
base_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, torch_dtype=torch.float32, device_map="cpu")
model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)

# Vector DB 로드
embeddings = HuggingFaceEmbeddings(model_name="jhgan/ko-sroberta-multitask")
vector_db = FAISS.load_local(DB_PATH, embeddings, allow_dangerous_deserialization=True)

def ask_law_lens(user_input):
    # [Discovery] 관련 법리 검색
    docs = vector_db.similarity_search(user_input, k=1)
    retrieved_rule = docs[0].page_content if docs else "관련 법령 없음"
    
    # [Logic] 파인튜닝된 프롬프트 구성
    prompt = f"### 사실관계:\n{user_input}\n\n### 관련 법리:\n{retrieved_rule}\n\n### 결론:"
    
    inputs = tokenizer(prompt, return_tensors="pt").to("cpu")
    
    print("\n⚖️ Law-Lens가 분석 중...")
    with torch.no_grad():
        output = model.generate(**inputs, max_new_tokens=100, temperature=0.1)
    
    result = tokenizer.decode(output[0], skip_special_tokens=True)
    return result

# 테스트 실행
if __name__ == "__main__":
    sample_query = "원청이 협의도 없이 단가를 20% 깎았는데 이거 불법이야?"
    print(ask_law_lens(sample_query))