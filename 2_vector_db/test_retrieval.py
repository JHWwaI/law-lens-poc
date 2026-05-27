import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

def test_rag_discovery(query):
    db_path = "../data/faiss_index"
    
    if not os.path.exists(db_path):
        print("❌ FAISS DB 폴더가 없습니다. 먼저 build_db.py를 실행해주세요.")
        return

    print("🧠 임베딩 모델을 로드 중입니다...")
    embeddings = HuggingFaceEmbeddings(model_name="jhgan/ko-sroberta-multitask")
    
    print("📂 로컬 Vector DB를 불러옵니다...")
    # 위험한 직렬화 허용 옵션(로컬에서 직접 만든 DB이므로 안전함)
    vector_db = FAISS.load_local(db_path, embeddings, allow_dangerous_deserialization=True)

    print(f"\n💬 사용자 질문 (Discovery): '{query}'\n")
    print("-" * 50)
    
    # 사용자의 질문과 가장 유사한 벡터(법리) 상위 2개를 찾습니다.
    docs = vector_db.similarity_search(query, k=2)
    
    if not docs:
        print("검색된 관련 법리가 없습니다.")
    else:
        for i, doc in enumerate(docs):
            print(f"🎯 [유사도 Top {i+1} 검색 결과]")
            print(f" - 추출된 법리: {doc.page_content}")
            print(f" - 출처(메타데이터): {doc.metadata.get('case_serial')}\n")
    print("-" * 50)

if __name__ == "__main__":
    # 법률 용어가 아닌, 실무에서 쓰는 '일상적인 표현'으로 검색해 봅니다.
    test_query = "원청이 납품 기한 핑계 대면서 돈을 마음대로 후려쳤어"
    test_rag_discovery(test_query)