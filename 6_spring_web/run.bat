@echo off
REM Law-Lens Web 실행 스크립트. 더블클릭 또는 PowerShell에서 .\run.bat
setlocal

if "%JAVA_HOME%"=="" (
    for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-17*") do set "JAVA_HOME=%%i"
)

if "%JAVA_HOME%"=="" (
    echo [ERROR] JAVA_HOME not set and no JDK 17 found.
    pause
    exit /b 1
)

cd /d "%~dp0"

if not exist "target\law-lens-web-1.0.0.jar" (
    echo [INFO] JAR not found, building...
    call .\mvnw.cmd package -DskipTests
    if errorlevel 1 (
        echo [ERROR] Build failed.
        pause
        exit /b 1
    )
)

echo [INFO] Starting Law-Lens Web on http://localhost:8080
"%JAVA_HOME%\bin\java.exe" -jar target\law-lens-web-1.0.0.jar
