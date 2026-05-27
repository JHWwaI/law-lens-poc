import requests
import json

def download_law_data_json():
    base_url = "http://www.law.go.kr/DRF/lawSearch.do"
    oc_id = "dolchi37@gmail.com" # 성공했던 ID
    
    params = {
        "OC": oc_id,
        "target": "prec",
        "type": "JSON",       # XML 대신 JSON으로 변경
        "display": "100",
    }
    
    print(f"📡 {oc_id} 계정으로 JSON 데이터 요청 중...")
    
    try:
        response = requests.get(base_url, params=params, timeout=10)
        # JSON 응답 확인
        data = response.json()
        
        # 법제처 JSON 응답에는 보통 'PrecSearch'나 'prec' 키가 있습니다.
        if "PrecSearch" in data or "prec" in data:
            print("✅ 성공! JSON 데이터를 정상적으로 수신했습니다.")
            return data
        else:
            print("❌ 실패: 응답 형식이 올바르지 않습니다.")
            print("응답 내용:", data)
            return None
            
    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        return None

if __name__ == "__main__":
    json_data = download_law_data_json()
    if json_data:
        with open("raw_prec_data.json", "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=4)
        print("📂 'raw_prec_data.json' 저장 완료!")