@echo off
echo Starting Simple Chat Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Dependencies not found! Installing...
    call install.bat
    echo.
)

echo Server starting on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start