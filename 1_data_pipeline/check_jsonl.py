# 1_data_pipeline/check_jsonl.py
import json

def verify_data_quality(file_path="../data/train_data.jsonl"):
    print("🔍 [검증 1] 학습 데이터 퀄리티 체크")
    with open(file_path, 'r') as f:
        first_line = f.readline()
        data = json.loads(first_line)
        
        print("\n--- 파싱된 JSON 구조 ---")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        # 필수 키(Key) 누락 검사
        assert "fact" in data["input"], "❌ 오류: 사실관계(fact) 누락!"
        assert "application" in data["output"], "❌ 오류: 논리 전개(application) 누락!"
        print("\n✅ 필수 스키마 통과! Teacher 모델이 일을 잘하고 있습니다.")

verify_data_quality()