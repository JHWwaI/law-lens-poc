import json
import random

# 1. 하도급법 주요 위반 유형 및 법리 데이터베이스
scenarios = [
    {
        "rule": "하도급법 제11조(부당한 대금의 감액 금지)",
        "facts": ["정당한 사유 없이 대금을 {percent}% 삭감함", "경영난을 이유로 협의 없이 대금을 {percent}% 깎고 잔금만 지급함", "발주처로부터 대금을 다 받고도 수급사업자에게는 {percent}% 감액하여 지급함"],
        "conclusions": ["하도급법 제11조 위반입니다. 원사업자는 정당한 사유 없이 하도급대금을 감액할 수 없습니다.", "부당한 대금 감액 행위로 판단되며, 삭감된 금액과 이자를 지급해야 합니다."]
    },
    {
        "rule": "하도급법 제13조(하도급대금의 지급 및 지연이자)",
        "facts": ["목적물 수령일로부터 {days}일이 지났으나 대금을 지급하지 않음", "대금을 {days}일 지연하여 지급하면서 지연이자를 미지급함", "어음 만기일이 60일을 초과했으나 어음할인료를 주지 않음"],
        "conclusions": ["하도급법 제13조 위반입니다. 60일 이내 대금 미지급 및 지연이자 미지급은 명백한 불법입니다.", "지연 지급 및 관련 수수료 미지급으로 인해 시정명령 대상이 될 수 있습니다."]
    },
    {
        "rule": "하도급법 제3조(서면의 발급 및 서류의 보존)",
        "facts": ["작업 시작 전 계약서를 발급하지 않고 구두로만 지시함", "공사 내용이 변경되었음에도 변경 서면을 교부하지 않음", "단가 등 핵심 사항이 누락된 불완전한 서면을 교부함"],
        "conclusions": ["하도급법 제3조 위반입니다. 모든 위탁 행위는 착수 전 서면 발급이 필수입니다.", "서면 미발급은 원사업자의 가장 기본적인 의무 위반에 해당합니다."]
    },
    {
        "rule": "하도급법 제12조의3(기술유용행위 금지)",
        "facts": ["수급사업자의 기술 자료를 승인 없이 제3자에게 노출함", "단가 후려치기를 위해 확보한 기술 자료를 경쟁 업체에 전달함", "정당한 사유 없이 기술 자료 임치를 강요하거나 유출함"],
        "conclusions": ["하도급법 제12조의3 위반입니다. 기술 자료 유용은 중징계 및 징벌적 손해배상 대상입니다.", "수급사업자의 경영권을 침해하는 기술 유용 행위로 판단됩니다."]
    }
]

companies = ["A사", "B건설", "C테크", "D산업", "E정보통신", "가나기업", "우리정밀"]
sub_companies = ["K업체", "L플랜트", "M소프트", "N금속", "S전기"]

def generate_500_data():
    datasets = []
    
    for i in range(500):
        # 무작위 시나리오 선택
        scenario = random.choice(scenarios)
        comp = random.choice(companies)
        sub_comp = random.choice(sub_companies)
        
        # 문구 조합
        fact_template = random.choice(scenario["facts"])
        fact = f"{comp}가 {sub_comp}에게 " + fact_template.format(
            percent=random.randint(5, 30), 
            days=random.randint(65, 120)
        )
        
        conclusion = random.choice(scenario["conclusions"])
        
        # JSONL 구조 생성
        data = {
            "input": {"fact": fact},
            "context": {"retrieved_rules": [scenario["rule"]]},
            "output": conclusion
        }
        datasets.append(data)

    # 파일 저장
    with open("train_data.jsonl", "w", encoding="utf-8") as f:
        for entry in datasets:
            f.write(json.dumps(entry, ensure_ascii=False) + '\n')
            
    print(f"✅ 500개의 고품질 학습 데이터가 'train_data.jsonl'로 생성되었습니다!")

if __name__ == "__main__":
    generate_500_data()