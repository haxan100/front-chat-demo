@echo off
echo Installing Simple Chat Server Dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo Next steps:
    echo 1. Setup MySQL database (run database.sql)
    echo 2. Start server with: npm start
    echo 3. Open http://localhost/chat/front-chat-demo/ in browser
    echo.
) else (
    echo.
    echo ❌ Failed to install dependencies!
    echo Please check your internet connection and try again.
    echo.
)

pause