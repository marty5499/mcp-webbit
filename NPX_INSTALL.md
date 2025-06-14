# 📦 WebBit MCP Service - NPX 安裝指南

## 🚀 快速安裝方式

### 方法一：直接透過 GitHub URL 安裝（推薦）

```bash
npx https://github.com/marty5499/mcp-webbit
```

### 方法二：配置 Claude Desktop 使用 npx

編輯 Claude Desktop 配置文件：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-webbit": {
      "command": "npx",
      "args": ["-y", "https://github.com/marty5499/mcp-webbit"]
    }
  }
}
```

### 方法三：配置 Cursor IDE 使用 npx

編輯 Cursor IDE 配置文件：

**macOS/Linux**: `~/.cursor/mcp.json`
**Windows**: `%APPDATA%\Cursor\mcp.json`

```json
{
  "mcpServers": {
    "mcp-webbit": {
      "command": "npx",
      "args": ["-y", "https://github.com/marty5499/mcp-webbit"]
    }
  }
}
```

## 🔧 為什麼使用 npx？

✅ **自動最新版本**：每次運行都會獲取最新版本
✅ **無需本地安裝**：不佔用本地存儲空間
✅ **自動依賴管理**：npx 會自動處理 Node.js 依賴
✅ **跨平台兼容**：在 Windows、macOS、Linux 上都能運行
✅ **零配置**：無需額外設定環境變數

## 📋 前置需求

- Node.js 18.0.0 或更高版本
- npm (通常隨 Node.js 一起安裝)
- 網際網路連線

## 🧪 驗證安裝

### 測試 npx 直接運行

```bash
# 測試服務是否可以正常啟動
npx https://github.com/marty5499/mcp-webbit --help
```

### 在 Claude Desktop 中測試

1. 重啟 Claude Desktop
2. 輸入測試指令：
   ```
   請使用 WebBit 工具生成一個按鈕控制 LED 的程式
   ```
3. 確認能看到生成的 MicroPython 程式碼

### 在 Cursor IDE 中測試

1. 重啟 Cursor IDE
2. 在對話中輸入：
   ```
   @mcp-webbit 生成一個顯示愛心圖案的程式
   ```
3. 確認工具正常回應

## ⚡ 進階用法

### 指定特定版本

```bash
# 使用特定 git tag 或 branch
npx https://github.com/marty5499/mcp-webbit#v1.0.0
```

### 快取控制

```bash
# 強制重新下載最新版本
npx --yes https://github.com/marty5499/mcp-webbit
```

### 除錯模式

```bash
# 啟用除錯輸出
DEBUG=mcp-webbit npx https://github.com/marty5499/mcp-webbit
```

## 🎯 使用場景

### 場景一：教學環境
老師可以要求學生直接使用：
```bash
npx https://github.com/marty5499/mcp-webbit
```
無需複雜的安裝步驟。

### 場景二：企業內部
在 Claude Desktop 配置中使用 npx，確保所有員工都使用最新版本：
```json
{
  "mcpServers": {
    "webbit-tool": {
      "command": "npx",
      "args": ["-y", "https://github.com/marty5499/mcp-webbit"]
    }
  }
}
```

### 場景三：開發測試
開發者可以快速測試不同版本：
```bash
# 測試 main branch
npx https://github.com/marty5499/mcp-webbit

# 測試 dev branch
npx https://github.com/marty5499/mcp-webbit#dev
```

## 🐛 故障排除

### 常見問題

1. **"找不到 npx 命令"**
   ```bash
   # 確認 Node.js 安裝
   node --version
   npm --version
   
   # 如果 npm >= 5.2.0，npx 應該已經包含
   # 否則需要升級 npm
   npm install -g npm@latest
   ```

2. **"網路錯誤"**
   ```bash
   # 設定 npm registry 鏡像（中國用戶）
   npm config set registry https://registry.npmmirror.com/
   
   # 或使用代理
   npm config set proxy http://proxy.company.com:8080
   ```

3. **"權限錯誤"**
   ```bash
   # 在 Unix 系統上，可能需要 sudo
   sudo npx https://github.com/marty5499/mcp-webbit
   
   # 或設定 npm 全域目錄
   npm config set prefix ~/.npm-global
   ```

4. **"版本衝突"**
   ```bash
   # 清除 npx 快取
   npx --clear-cache
   
   # 強制重新安裝
   npx --yes --force https://github.com/marty5499/mcp-webbit
   ```

### 檢查日誌

```bash
# 啟用詳細日誌
npm config set loglevel verbose
npx https://github.com/marty5499/mcp-webbit
```

## 🔄 更新和維護

### 自動更新
使用 npx 的優勢是每次運行都會檢查最新版本，通常無需手動更新。

### 手動強制更新
```bash
npx --clear-cache
npx --yes https://github.com/marty5499/mcp-webbit
```

### 離線使用
如果需要離線使用，建議使用本地安裝方式：
```bash
git clone https://github.com/marty5499/mcp-webbit.git
cd mcp-webbit
npm install
npm start
```

## 📊 效能考量

- **首次運行**：需要下載和安裝，可能需要 10-30 秒
- **後續運行**：使用快取，通常 2-5 秒內啟動
- **記憶體使用**：約 50-100MB
- **網路流量**：首次約 10-20MB，後續僅更新差異

## 🎉 完成！

現在使用者可以透過簡單的 npx 命令即可安裝和使用 WebBit MCP Service：

```bash
npx https://github.com/marty5499/mcp-webbit
```

這是最簡單、最可靠的安裝方式！ 