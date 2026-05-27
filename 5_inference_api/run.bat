@echo off
REM Law-Lens Inference API (Mock 모드) 실행 스크립트
setlocal

cd /d "%~dp0"

set LAWLENS_MOCK_MODE=1
set LAWLENS_DB_PATH=..\data\faiss_index

echo [INFO] Starting Law-Lens Inference API (mock) on http://localhost:8000
uvicorn main:app --host 0.0.0.0 --port 8000
