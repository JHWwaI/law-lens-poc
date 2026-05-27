import xml.etree.ElementTree as ET
import json
import re

def parse_xml_to_jsonl_final(xml_file, output_file):
    try:
        # 파일을 텍스트로 읽어서 실제 태그명을 먼저 확인합니다.
        with open(xml_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # '법령단위'나 'item' 중 들어있는 태그를 자동으로 선택
        target_tag = '법령단위' if '법령단위' in content else 'item'
        print(f"🔍 '{target_tag}' 태그로 분석을 시작합니다...")

        root = ET.fromstring(content)
        datasets = []
        
        for item in root.findall(f'.//{target_tag}'):
            # 태그명이 다를 수 있으므로 리스트로 시도
            case_name = item.findtext('사건명') or item.findtext('precNm') or ""
            fact = item.findtext('판시사항') or item.findtext('precHold') or ""
            reason = item.findtext('판결요지') or item.findtext('precDetail') or ""
            
            if not case_name and not fact: continue
            
            datasets.append({
                "input": {"fact": re.sub(r'<[^>]+>', '', fact if fact else case_name)},
                "context": {"retrieved_rules": [re.sub(r'<[^>]+>', '', case_name)]},
                "output": re.sub(r'<[^>]+>', '', reason if reason else "판결 요지 내용 없음")
            })

        with open(output_file, 'w', encoding='utf-8') as f:
            for entry in datasets:
                f.write(json.dumps(entry, ensure_ascii=False) + '\n')
        
        print(f"✅ 성공! 총 {len(datasets)}개의 데이터를 확보했습니다.")
    except Exception as e:
        print(f"❌ 에러 발생: {e}")

if __name__ == "__main__":
    parse_xml_to_jsonl_final("raw_prec_data.xml", "train_data.jsonl")