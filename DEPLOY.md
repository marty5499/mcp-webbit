# 🚀 WebBit MCP Service 部署指南

## 一、推送到 GitHub

### 1. 在 GitHub 創建 Repository

1. 前往 [GitHub](https://github.com) 並登入
2. 點擊右上角的 "+" → "New repository"
3. 設定 Repository：
   - **Name**: `mcp-webbit`
   - **Description**: `MCP service for generating WebBit MicroPython code`
   - **Visibility**: **Public** (重要：讓 Cursor IDE 可以存取)
   - **不要**勾選 "Initialize with README"
4. 點擊 "Create repository"

### 2. 設定正確的 Remote URL

```bash
# 移除現有的 remote（如果有）
git remote remove origin

# 添加您的 GitHub repository URL
git remote add origin https://github.com/您的用戶名/mcp-webbit.git

# 推送到 GitHub
git push -u origin main
```

### 3. 驗證推送成功

推送完成後，前往您的 GitHub repository 頁面確認：
- 所有文件都已上傳
- README.md 正確顯示
- 可以看到 "mcp-webbit" 的專案說明

## 二、更新安裝文件中的 URL

推送成功後，請執行以下命令更新文件中的 URL：

```bash
# 更新 README.md 中的 GitHub URL
sed -i '' 's/your-username/您的GitHub用戶名/g' README.md
sed -i '' 's/your-username/您的GitHub用戶名/g' INSTALL.md
sed -i '' 's/your-username/您的GitHub用戶名/g' package.json

# 提交更新
git add .
git commit -m "docs: update GitHub URLs to actual repository"
git push origin main
```

## 三、在 Cursor IDE 中測試安裝

### 方法 1: 使用 MCP Install 功能

1. 打開 Cursor IDE
2. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
3. 輸入 "MCP" 並選擇 "MCP: Install Server"
4. 輸入您的 repository URL：
   ```
   https://github.com/您的用戶名/mcp-webbit
   ```
5. 等待安裝完成並重啟 Cursor IDE

### 方法 2: 使用 npx 安裝

```bash
npx https://github.com/您的用戶名/mcp-webbit
```

### 方法 3: 手動配置 Claude Desktop

編輯配置文件：
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-webbit": {
      "command": "npx",
      "args": ["-y", "https://github.com/您的用戶名/mcp-webbit"]
    }
  }
}
```

## 四、測試安裝

在 Cursor IDE 或 Claude Desktop 中測試：

```
請使用 WebBit 工具生成一個按鈕控制 LED 的程式
```

如果看到生成的 MicroPython 程式碼，表示安裝成功！

## 五、發布到 npm（可選）

如果想要更專業的部署，可以發布到 npm：

```bash
# 登入 npm
npm login

# 發布（確保 package.json 中的 name 是唯一的）
npm publish

# 之後用戶可以直接安裝
npm install -g mcp-webbit
```

## 六、自動化發布流程

您可以使用以下命令進行版本更新和發布：

```bash
# 更新版本並推送
npm run release

# 或者手動操作
npm version patch  # 或 minor, major
git push origin main --tags
```

## 故障排除

### 推送失敗
- 確認 GitHub repository 存在且為 public
- 檢查 git remote URL 是否正確
- 確認有推送權限

### 安裝失敗
- 確認 repository 是 public
- 檢查 Node.js 版本 >= 18.0.0
- 嘗試清除 npm cache: `npm cache clean --force`

### 權限問題
- 在 Unix 系統上，確保 index.js 有執行權限：
  ```bash
  chmod +x index.js
  ```

## 完成！

現在您的 WebBit MCP Service 已經部署到雲端，任何人都可以通過 Cursor IDE 或 Claude Desktop 安裝和使用了！🎉 