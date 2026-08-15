@echo off
REM =====================================================================
REM  Ligar XRouter - inicia o painel localmente (http://localhost:20127).
REM  Usa a PASTA DESTE ARQUIVO (sem caminhos fixos). O Headroom sobe junto,
REM  automaticamente, quando instalado. Sem dados pessoais neste arquivo.
REM =====================================================================
cd /d "%~dp0"
where npm >nul 2>nul || ( echo [ERRO] Node.js/npm nao encontrado no PATH. Instale o Node 20+ e tente de novo. & pause & exit /b 1 )
if not exist "node_modules" ( echo Instalando dependencias ^(so na primeira vez, pode demorar^)... & call npm install )
if exist ".next\BUILD_ID" (
  echo Iniciando XRouter ^(producao^) em http://localhost:20127 ...
  start "XRouter" /min cmd /c "npm start"
) else (
  echo Iniciando XRouter ^(dev^) em http://localhost:20127 ...
  start "XRouter" /min cmd /c "npm run dev"
)
timeout /t 8 >nul
start "" "http://localhost:20127"
