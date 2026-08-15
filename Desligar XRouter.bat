@echo off
REM =====================================================================
REM  Desligar XRouter - encerra o painel (processo que ouve na porta 20127).
REM =====================================================================
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :20127 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>nul
echo XRouter parado.
timeout /t 1 >nul
