# WebBit MCP Service 安裝指南

## 快速安裝（推薦）

### 在 Cursor IDE 中一鍵安裝

1. 打開 Cursor IDE
2. 按下 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
3. 輸入 "MCP" 並選擇 "MCP: Install Server"
4. 輸入以下 URL：
   ```
   https://github.com/your-username/mcp-webbit
   ```
5. 等待安裝完成，重啟 Cursor IDE

### 使用 npx 直接運行

如果您有 Node.js 18+ 環境，可以直接使用：

```bash
npx https://github.com/your-username/mcp-webbit
```

## Claude Desktop 手動配置

### macOS 配置

1. 打開終端機
2. 編輯配置文件：
   ```bash
   nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```
3. 添加以下配置：
   ```json
   {
     "mcpServers": {
       "mcp-webbit": {
         "command": "npx",
         "args": ["-y", "https://github.com/your-username/mcp-webbit"]
       }
     }
   }
   ```
4. 儲存並重啟 Claude Desktop

### Windows 配置

1. 按 `Win+R`，輸入 `%APPDATA%\Claude`
2. 編輯 `claude_desktop_config.json` 文件
3. 添加相同的配置內容（如上）
4. 儲存並重啟 Claude Desktop

### Linux 配置

配置文件通常位於：`~/.config/Claude/claude_desktop_config.json`

## 本地開發安裝

### 前置需求

- Node.js 18.0.0 或更高版本
- npm 或 yarn
- Git

### 步驟

1. **Clone 專案**
   ```bash
   git clone https://github.com/your-username/mcp-webbit.git
   cd mcp-webbit
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **測試服務**
   ```bash
   npm test
   ```

4. **啟動服務**
   
   生產模式：
   ```bash
   npm start
   ```
   
   開發模式（自動重載）：
   ```bash
   npm run dev
   ```

5. **配置 Claude Desktop**
   
   使用絕對路徑配置：
   ```json
   {
     "mcpServers": {
       "mcp-webbit": {
         "command": "node",
         "args": ["/完整路徑/mcp-webbit/index.js"]
       }
     }
   }
   ```

## 驗證安裝

### 在 Cursor IDE 中測試

1. 打開 Cursor IDE
2. 開啟新對話
3. 輸入以下測試指令：
   ```
   請使用 WebBit 工具生成一個簡單的 LED 顯示程式
   ```
4. 確認工具能正常回應並生成程式碼

### 在 Claude Desktop 中測試

1. 打開 Claude Desktop
2. 輸入測試指令：
   ```
   @mcp-webbit 生成一個按鈕控制 LED 的程式
   ```
3. 檢查是否正確生成 MicroPython 程式碼

## 故障排除

### 常見問題

1. **"找不到模組" 錯誤**
   - 確認 Node.js 版本 >= 18.0.0
   - 重新執行 `npm install`

2. **"無法連接到 MCP 服務" 錯誤**
   - 檢查配置文件路徑是否正確
   - 確認服務是否正在運行
   - 重啟 Cursor IDE 或 Claude Desktop

3. **權限錯誤**
   - 在 macOS/Linux 上可能需要執行權限：
     ```bash
     chmod +x index.js
     ```

4. **網路問題**
   - 如果 npx 安裝失敗，嘗試本地安裝方式
   - 檢查防火牆設定

### 除錯模式

啟用除錯輸出：
```bash
DEBUG=mcp-webbit npm run dev
```

### 檢查日誌

- Cursor IDE 日誌：`Help > Show Logs`
- Claude Desktop 日誌：查看應用程式控制台

## 更新服務

### 使用 npx 安裝的版本

npx 會自動使用最新版本，無需手動更新。

### 本地安裝的版本

```bash
cd mcp-webbit
git pull origin main
npm install
```

## 卸載

### 從 Cursor IDE 卸載

1. 打開 `Cmd+Shift+P`
2. 選擇 "MCP: Uninstall Server"
3. 選擇 "mcp-webbit"

### 手動卸載

1. 從配置文件中刪除 mcp-webbit 相關配置
2. 刪除本地專案目錄（如果是本地安裝）

## 支援

如果遇到問題，請：
1. 查看 [Issues](https://github.com/your-username/mcp-webbit/issues)
2. 提交新的 Issue 並包含錯誤日誌
3. 聯繫開發者 