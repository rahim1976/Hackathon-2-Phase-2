@echo off
set PYTHONPATH=%~dp0;%PYTHONPATH%
cd /d "%~dp0backend\src"
python -m uvicorn main:app --host 0.0.0.0 --port 8000