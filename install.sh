#!/bin/bash

# WebBit MCP Service 一鍵安裝腳本
# 適用於 macOS 和 Linux

echo "🚀 WebBit MCP Service 安裝程式"
echo "================================="

# 檢查 Node.js
echo "📋 檢查前置需求..."

if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，請先安裝 Node.js 18.0.0 或更高版本"
    echo "   下載地址: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d 'v' -f2 | cut -d '.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本過低 (當前: $(node --version))，需要 18.0.0 或更高版本"
    exit 1
fi

echo "✅ Node.js 版本檢查通過: $(node --version)"

if ! command -v npx &> /dev/null; then
    echo "❌ 未找到 npx，請升級 npm"
    echo "   執行: npm install -g npm@latest"
    exit 1
fi

echo "✅ npx 檢查通過"

# 測試 npx 安裝
echo ""
echo "🔧 測試 npx 安裝..."
if npx --yes https://github.com/marty5499/mcp-webbit --version &> /dev/null; then
    echo "✅ npx 安裝測試成功"
else
    echo "❌ npx 安裝測試失敗，請檢查網路連線"
    exit 1
fi

# 選擇安裝方式
echo ""
echo "📦 請選擇安裝方式:"
echo "1) 配置 Claude Desktop"
echo "2) 配置 Cursor IDE"
echo "3) 僅測試運行"
echo ""
read -p "請輸入選項 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔧 配置 Claude Desktop..."
        
        # 檢查 macOS 或 Linux
        if [[ "$OSTYPE" == "darwin"* ]]; then
            CONFIG_DIR="$HOME/Library/Application Support/Claude"
            CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
        else
            CONFIG_DIR="$HOME/.config/Claude"
            CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
        fi
        
        # 創建配置目錄
        mkdir -p "$CONFIG_DIR"
        
        # 備份現有配置
        if [ -f "$CONFIG_FILE" ]; then
            cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
            echo "✅ 已備份現有配置"
        fi
        
        # 創建或更新配置
        cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "mcp-webbit": {
      "command": "npx",
      "args": ["-y", "https://github.com/marty5499/mcp-webbit"]
    }
  }
}
EOF
        
        echo "✅ Claude Desktop 配置完成"
        echo "📍 配置文件位置: $CONFIG_FILE"
        echo "🔄 請重啟 Claude Desktop 以使配置生效"
        ;;
        
    2)
        echo ""
        echo "🔧 配置 Cursor IDE..."
        
        CONFIG_DIR="$HOME/.cursor"
        CONFIG_FILE="$CONFIG_DIR/mcp.json"
        
        # 創建配置目錄
        mkdir -p "$CONFIG_DIR"
        
        # 備份現有配置
        if [ -f "$CONFIG_FILE" ]; then
            cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
            echo "✅ 已備份現有配置"
        fi
        
        # 創建或更新配置
        cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "mcp-webbit": {
      "command": "npx",
      "args": ["-y", "https://github.com/marty5499/mcp-webbit"]
    }
  }
}
EOF
        
        echo "✅ Cursor IDE 配置完成"
        echo "📍 配置文件位置: $CONFIG_FILE"
        echo "🔄 請重啟 Cursor IDE 以使配置生效"
        ;;
        
    3)
        echo ""
        echo "🧪 測試運行 WebBit MCP Service..."
        echo "按 Ctrl+C 停止服務"
        echo ""
        npx --yes https://github.com/marty5499/mcp-webbit
        ;;
        
    *)
        echo "❌ 無效選項"
        exit 1
        ;;
esac

echo ""
echo "🎉 安裝完成！"
echo ""
echo "📖 使用方式:"
echo "   在 Claude Desktop 或 Cursor IDE 中輸入："
echo "   '請使用 WebBit 工具生成一個按鈕控制 LED 的程式'"
echo ""
echo "📚 更多資訊:"
echo "   - 完整文件: https://github.com/marty5499/mcp-webbit"
echo "   - NPX 安裝指南: https://github.com/marty5499/mcp-webbit/blob/main/NPX_INSTALL.md"
echo ""
echo "🐛 如遇問題，請查看: https://github.com/marty5499/mcp-webbit/issues" 