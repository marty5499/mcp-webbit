# WebBit MCP Service

這是一個基於 Model Context Protocol (MCP) 的服務，可以根據需求自動生成 WebBit MicroPython 程式碼。

## 功能特色

- 🤖 **智能程式生成**：根據繁體中文需求描述自動生成完整的 MicroPython 程式
- 📚 **完整 API 支援**：涵蓋 WebBit 所有功能，包括 LED 矩陣、感測器、按鈕、MQTT 等
- 🎯 **智能需求分析**：自動識別需求中的關鍵詞並生成對應功能
- 💡 **詳細註解**：提供清楚的程式說明和 API 使用指南
- 🔧 **模組化設計**：使用 ES6 模組和現代 JavaScript 特性

## 🚀 快速安裝 (npx)

**最簡單的方式：**
```bash
npx https://github.com/marty5499/mcp-webbit
```

或在 Claude Desktop / Cursor IDE 配置中使用：
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

> 📋 詳細的 npx 安裝指南請參考 [NPX_INSTALL.md](./NPX_INSTALL.md)

## 安裝與設定

### 方法一：直接從 GitHub 安裝（推薦）

#### 在 Cursor IDE 中安裝

1. 打開 Cursor IDE
2. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux) 打開命令面板
3. 輸入 "MCP" 並選擇 "MCP: Install Server"
4. 輸入此 repository 的 URL：
   ```
   https://github.com/marty5499/mcp-webbit
   ```

#### 手動配置 Claude Desktop

1. 複製以下配置到 Claude Desktop 配置文件：

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

### 方法二：本地開發安裝

#### 1. Clone 專案

```bash
git clone https://github.com/marty5499/mcp-webbit.git
cd mcp-webbit
```

#### 2. 安裝依賴

```bash
npm install
```

#### 3. 啟動服務

```bash
npm start
```

#### 4. 開發模式

```bash
npm run dev
```

#### 5. 配置 Claude Desktop（本地版本）

```json
{
  "mcpServers": {
    "mcp-webbit": {
      "command": "node",
      "args": ["/path/to/mcp-webbit/index.js"]
    }
  }
}
```

## 使用方式

### MCP 工具調用

這個服務提供一個 MCP 工具：`generate_webbit_code`

#### 參數

- `requirements` (必需): 程式需求描述（繁體中文）
- `include_comments` (可選): 是否包含詳細註解（預設為 true）

#### 範例調用

```json
{
  "name": "generate_webbit_code",
  "arguments": {
    "requirements": "按下按鈕A顯示愛心，按下按鈕B顯示哭臉，同時按下AB顯示開心",
    "include_comments": true
  }
}
```

## 支援的功能

### LED 矩陣顯示
- ✅ 圖形顯示 (`matrix`)
- ✅ 全屏顯示 (`showAll`)
- ✅ 跑馬燈 (`scroll`)
- ✅ 單顆 LED 控制 (`show`)

### 輸入控制
- ✅ 按鈕 A/B (`btnA`, `btnB`)
- ✅ 觸摸感測 (`touchP0`, `touchP1`, `touchP2`)

### 感測器
- ✅ 溫度感測 (`temp`)
- ✅ 光度感測 (`leftLight`, `rightLight`)
- ✅ DHT11 溫濕度感測器 (`dht11`)
- ✅ 超音波距離感測 (`ultrasonic`)
- ✅ 聲音偵測 (`soundDetect`)
- ✅ 震動偵測 (`vibration`)

### 控制輸出
- ✅ GPIO 控制 (`setPin`, `readPin`)
- ✅ 類比輸入 (`adc`)
- ✅ 伺服馬達 (`sg90`)
- ✅ 音樂播放 (`play`)

### 網路功能
- ✅ MQTT 訊息傳送/接收 (`pub`, `sub`)

## 圖形名稱對照

服務內建完整的圖形名稱對照表，支援以下圖形：

- 表情：開心、難過
- 手勢：剪刀、石頭、布
- 愛心：愛心1、愛心2、愛心3
- 箭頭：上箭頭、下箭頭、左箭頭、右箭頭等
- 幾何圖形：三角形、正方形、圓形、菱形、星星
- 其他：音符、旗子、飛機、皇冠等

## 範例需求

### 基礎 LED 控制
```
"顯示開心圖案"
"全部燈亮白色"
"跑馬燈顯示 Hello 文字"
```

### 按鈕互動
```
"按下按鈕A顯示愛心，按下按鈕B顯示星星"
"同時按下AB按鈕顯示皇冠"
```

### 感測器應用
```
"讀取溫度並顯示在LED上"
"使用超音波感測器測距離"
"DHT11感測器讀取溫濕度"
```

### 馬達控制
```
"控制伺服馬達轉動90度"
"按鈕控制馬達旋轉角度"
```

### MQTT 通訊
```
"接收MQTT訊息並顯示在LED矩陣"
"按鈕按下時傳送MQTT訊息"
```

## 生成的程式結構

所有生成的程式都基於以下結構：

```python
import uasyncio
from webduino.webbit import WebBit

# 自動生成的函數（如需要）
def callback_function():
    # 回調函數邏輯
    pass

async def main():
    # WebBit 初始化
    wbit = WebBit(mqtt=False)  # 根據需求自動設定
    
    # 設定（腳位配置、感測器初始化等）
    
    while True:
        # 主要邏輯迴圈
        await uasyncio.sleep_ms(10)

uasyncio.run(main())
```

## 技術細節

- **語言**: Node.js (ES6 modules)
- **MCP SDK**: @modelcontextprotocol/sdk
- **支援的 Node.js 版本**: >= 18.0.0
- **程式碼生成**: 基於需求關鍵詞分析和模組化組合

## 開發指南

### 新增功能支援

1. 在 `analyzeRequirements` 方法中新增關鍵詞偵測
2. 實作對應的程式碼生成邏輯
3. 更新註解和文件

### 自訂圖形

修改 `SHAPE_MAPPING` 物件以新增或更改圖形名稱對照。

## 注意事項

- 生成的程式碼需要在實際 WebBit 硬體上執行
- 腳位設定可能需要根據實際硬體連接進行調整
- MQTT 功能需要網路連線和正確的 broker 設定

## License

MIT 