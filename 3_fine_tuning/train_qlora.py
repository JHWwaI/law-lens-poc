import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer
import wandb

wandb.login() # 터미널에서 최초 1회 로그인 필요
wandb.init(project="law-lens-poc", name="hsubcontract-lora-v1")

# 1. 베이스 모델 로드 (예: 오픈소스 한국어 모델)
model_id = "beomi/Llama-3-Open-Ko-8B" 
tokenizer = AutoTokenizer.create_pretrained(model_id)

# QLoRA를 위한 4bit 양자화 설정 (메모리 절약)
bnb_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16)
model = AutoModelForCausalLM.from_pretrained(model_id, quantization_config=bnb_config)

# 2. LoRA 어댑터 설정 (모델의 '뇌' 일부만 학습하여 효율 극대화)
peft_config = LoraConfig(
    r=16, 
    lora_alpha=32, 
    target_modules=["q_proj", "v_proj"], 
    bias="none", 
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, peft_config)

# 3. Step 1에서 만든 교과서(JSONL) 불러오기
dataset = load_dataset("json", data_files="../data/train_data.jsonl", split="train")

# 4. 학습 실행 (Fine-Tuning)
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    dataset_text_field="input", 
    peft_config=peft_config,
    max_seq_length=1024,
    args=TrainingArguments(
        output_dir="./results",
        logging_steps=10,         # 10 스텝마다 로그 기록
        report_to="wandb",        # 🔥 W&B 대시보드로 실시간 결과 전송
        evaluation_strategy="steps",
        eval_steps=50             # 50 스텝마다 검증셋으로 평가
    )
)

trainer.train()

# 5. 나만의 법률 전문가 모델(가중치) 로컬에 저장!
trainer.model.save_pretrained("./law_model_adapter")