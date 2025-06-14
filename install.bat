@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo 🚀 WebBit MCP Service 安裝程式
echo =================================
echo.

REM 檢查 Node.js
echo 📋 檢查前置需求...

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js，請先安裝 Node.js 18.0.0 或更高版本
    echo    下載地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 獲取 Node.js 版本
for /f "tokens=1 delims=v" %%a in ('node --version') do set NODE_VERSION=%%a
for /f "tokens=1 delims=." %%a in ("%NODE_VERSION%") do set MAJOR_VERSION=%%a
set MAJOR_VERSION=%MAJOR_VERSION:~1%

if %MAJOR_VERSION% lss 18 (
    echo ❌ Node.js 版本過低，需要 18.0.0 或更高版本
    echo    當前版本: %NODE_VERSION%
    pause
    exit /b 1
)

echo ✅ Node.js 版本檢查通過: %NODE_VERSION%

npx --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 npx，請升級 npm
    echo    執行: npm install -g npm@latest
    pause
    exit /b 1
)

echo ✅ npx 檢查通過
echo.

REM 測試 npx 安裝
echo 🔧 測試 npx 安裝...
npx --yes https://github.com/marty5499/mcp-webbit --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npx 安裝測試失敗，請檢查網路連線
    pause
    exit /b 1
)

echo ✅ npx 安裝測試成功
echo.

REM 選擇安裝方式
echo 📦 請選擇安裝方式:
echo 1) 配置 Claude Desktop
echo 2) 配置 Cursor IDE
echo 3) 僅測試運行
echo.
set /p choice=請輸入選項 (1-3): 

if "%choice%"=="1" (
    echo.
    echo 🔧 配置 Claude Desktop...
    
    set "CONFIG_DIR=%APPDATA%\Claude"
    set "CONFIG_FILE=!CONFIG_DIR!\claude_desktop_config.json"
    
    REM 創建配置目錄
    if not exist "!CONFIG_DIR!" mkdir "!CONFIG_DIR!"
    
    REM 備份現有配置
    if exist "!CONFIG_FILE!" (
        copy "!CONFIG_FILE!" "!CONFIG_FILE!.backup.%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul
        echo ✅ 已備份現有配置
    )
    
    REM 創建或更新配置
    (
        echo {
        echo   "mcpServers": {
        echo     "mcp-webbit": {
        echo       "command": "npx",
        echo       "args": ["-y", "https://github.com/marty5499/mcp-webbit"]
        echo     }
        echo   }
        echo }
    ) > "!CONFIG_FILE!"
    
    echo ✅ Claude Desktop 配置完成
    echo 📍 配置文件位置: !CONFIG_FILE!
    echo 🔄 請重啟 Claude Desktop 以使配置生效
    
) else if "%choice%"=="2" (
    echo.
    echo 🔧 配置 Cursor IDE...
    
    set "CONFIG_DIR=%USERPROFILE%\.cursor"
    set "CONFIG_FILE=!CONFIG_DIR!\mcp.json"
    
    REM 創建配置目錄
    if not exist "!CONFIG_DIR!" mkdir "!CONFIG_DIR!"
    
    REM 備份現有配置
    if exist "!CONFIG_FILE!" (
        copy "!CONFIG_FILE!" "!CONFIG_FILE!.backup.%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul
        echo ✅ 已備份現有配置
    )
    
    REM 創建或更新配置
    (
        echo {
        echo   "mcpServers": {
        echo     "mcp-webbit": {
        echo       "command": "npx",
        echo       "args": ["-y", "https://github.com/marty5499/mcp-webbit"]
        echo     }
        echo   }
        echo }
    ) > "!CONFIG_FILE!"
    
    echo ✅ Cursor IDE 配置完成
    echo 📍 配置文件位置: !CONFIG_FILE!
    echo 🔄 請重啟 Cursor IDE 以使配置生效
    
) else if "%choice%"=="3" (
    echo.
    echo 🧪 測試運行 WebBit MCP Service...
    echo 按 Ctrl+C 停止服務
    echo.
    npx --yes https://github.com/marty5499/mcp-webbit
    
) else (
    echo ❌ 無效選項
    pause
    exit /b 1
)

echo.
echo 🎉 安裝完成！
echo.
echo 📖 使用方式:
echo    在 Claude Desktop 或 Cursor IDE 中輸入：
echo    '請使用 WebBit 工具生成一個按鈕控制 LED 的程式'
echo.
echo 📚 更多資訊:
echo    - 完整文件: https://github.com/marty5499/mcp-webbit
echo    - NPX 安裝指南: https://github.com/marty5499/mcp-webbit/blob/main/NPX_INSTALL.md
echo.
echo 🐛 如遇問題，請查看: https://github.com/marty5499/mcp-webbit/issues
echo.
pause 