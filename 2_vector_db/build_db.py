import os
import json
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

def build_local_vector_db():
    jsonl_path = "../data/train_data.jsonl"
    db_save_path = "../data/faiss_index"
    
    if not os.path.exists(jsonl_path):
        print(f"❌ 데이터 파일이 없습니다: {jsonl_path}")
        return

    print("🧠 한국어 특화 임베딩 모델을 로드합니다 (최초 실행 시 다운로드 소요)...")
    # 한국어 문장 유사도에 특화된 가벼운 로컬 모델
    embeddings = HuggingFaceEmbeddings(model_name="jhgan/ko-sroberta-multitask")

    docs = []
    print("📂 JSONL 데이터에서 지식(Rule)을 추출합니다...")
    
    with open(jsonl_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            rules = data.get("context", {}).get("retrieved_rules", [])
            case_serial = data.get("metadata", {}).get("case_serial", "Unknown")
            
            for rule in rules:
                # 추출한 텍스트를 LangChain Document 객체로 변환 (메타데이터 포함)
                doc = Document(page_content=rule, metadata={"case_serial": case_serial})
                docs.append(doc)

    if not docs:
        print("⚠️ 추출할 법리(Rule) 데이터가 없습니다.")
        return

    print(f"🚀 총 {len(docs)}개의 법리 데이터를 벡터로 변환하여 FAISS DB에 적재합니다...")
    # 텍스트를 벡터로 변환하여 로컬 DB 생성
    vector_db = FAISS.from_documents(docs, embeddings)
    
    # 생성된 DB를 로컬 폴더에 저장
    os.makedirs(db_save_path, exist_ok=True)
    vector_db.save_local(db_save_path)
    
    print(f"🎉 Vector DB 구축 완료! '{db_save_path}' 폴더에 저장되었습니다.")

if __name__ == "__main__":
    build_local_vector_db()