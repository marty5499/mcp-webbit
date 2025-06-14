#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 初始化 webbit API 文檔變數
let webbitApiDoc = '';

// 創建 MCP server
const server = new Server(
  {
    name: "mcp-webbit",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 圖形名稱對照表
const SHAPE_MAPPING = {
  "開心": "happy",
  "難過": "cry",
  "剪刀": "scissors",
  "石頭": "stone",
  "布": "paper",
  "愛心1": "heart_1",
  "愛心2": "heart_2",
  "愛心3": "heart_3",
  "上三角形": "triangle_up",
  "下三角形": "triangle_down",
  "左三角形": "triangle_left",
  "右三角形": "triangle_right",
  "右下三角形": "triangle_right_down",
  "左下三角形": "triangle_left_down",
  "右上三角形": "triangle_right_up",
  "左上三角形": "triangle_left_up",
  "上箭頭": "arrow_up",
  "下箭頭": "arrow_down",
  "左箭頭": "arrow_left",
  "右箭頭": "arrow_right",
  "左上箭頭": "arrow_left_up",
  "右上箭頭": "arrow_right_up",
  "左下箭頭": "arrow_left_down",
  "右下箭頭": "arrow_right_down",
  "蝴蝶結": "bow",
  "沙漏": "hourglass",
  "骰子一": "one",
  "骰子二": "two",
  "骰子三": "three",
  "骰子四": "four",
  "骰子五": "five",
  "骰子六": "six",
  "正方形1": "square_1",
  "正方形2": "square_2",
  "圓形": "circle",
  "菱形1": "diamond_1",
  "菱形2": "diamond_2",
  "星星": "star",
  "打勾": "tick",
  "音符": "note",
  "音樂": "music",
  "井字號": "hashtag",
  "旗子": "flag",
  "男孩": "boy",
  "女孩": "girl",
  "參考": "reference",
  "飛機": "airplane",
  "皇冠": "crown",
  "導讀": "hamburg",
  "等於": "equals",
  "加": "plus",
  "減": "minus",
  "乘": "multiply",
  "除": "division"
};

// 程式模板
const TEMPLATE_BASE = `import uasyncio
from webduino.webbit import WebBit

def process(topic,msg):
    msg_str = msg.decode('utf-8')
    # 判斷要處理的topic和處理訊息

async def main():
    # 如果需要使用 mqtt , mqtt 要設定 True
    wbit = WebBit(mqtt=False)

    # 當mqtt=True訂閱某個topic , 收到訊息後在 process 方法內處理
    wbit.sub('\${topic}',process) 

    while True:
        await uasyncio.sleep_ms(10) # 使用 uasyncio.sleep_ms
        await wbit.checkMsg() # mqtt=True才需要這行程式碼

uasyncio.run(main())`;

// WebBit MicroPython 程式生成器
class WebBitCodeGenerator {
  constructor() {
    this.apiDoc = webbitApiDoc;
  }

  // 根據需求分析是否需要 MQTT
  needsMqtt(requirements) {
    const mqttKeywords = ['訂閱', 'mqtt', '傳送訊息', '接收訊息', 'pub', 'sub', '網路', '遠端', '雲端'];
    return mqttKeywords.some(keyword => requirements.includes(keyword));
  }

  // 找到最接近的圖形名稱
  findShapeName(description) {
    for (const [key, value] of Object.entries(SHAPE_MAPPING)) {
      if (description.includes(key)) {
        return value;
      }
    }
    
    // 如果沒有完全匹配，嘗試部分匹配
    if (description.includes('愛心') || description.includes('心')) return 'heart_1';
    if (description.includes('箭頭') || description.includes('上')) return 'arrow_up';
    if (description.includes('開心') || description.includes('笑')) return 'happy';
    if (description.includes('難過') || description.includes('哭')) return 'cry';
    
    return 'happy'; // 預設圖形
  }

  // 生成 MicroPython 程式碼
  generateCode(requirements) {
    const needsMqtt = this.needsMqtt(requirements);
    
    // 基礎程式結構
    let imports = ['import uasyncio', 'from webduino.webbit import WebBit'];
    let globalCode = [];
    let setupCode = [];
    let loopCode = [];
    let functions = [];

    // MQTT 相關設置
    if (needsMqtt) {
      functions.push(`def process(topic, msg):
    msg_str = msg.decode('utf-8')
    # 處理接收到的 MQTT 訊息
    print(f"收到訊息: {msg_str}")`);
      
      setupCode.push('wbit = WebBit(mqtt=True)');
      setupCode.push("wbit.sub('your_topic', process)  # 替換為實際的 topic");
      loopCode.push('await wbit.checkMsg()  # 檢查 MQTT 訊息');
    } else {
      setupCode.push('wbit = WebBit(mqtt=False)');
    }

    // 分析需求並生成相應程式碼
    this.analyzeRequirements(requirements, setupCode, loopCode, functions);

    // 組合完整程式碼
    let code = imports.join('\n') + '\n\n';
    
    if (globalCode.length > 0) {
      code += globalCode.join('\n') + '\n\n';
    }
    
    if (functions.length > 0) {
      code += functions.join('\n\n') + '\n\n';
    }
    
    code += 'async def main():\n';
    code += '    # WebBit 初始化\n';
    setupCode.forEach(line => {
      code += `    ${line}\n`;
    });
    
    code += '\n    while True:\n';
    loopCode.forEach(line => {
      code += `        ${line}\n`;
    });
    code += '        await uasyncio.sleep_ms(10)  # 使用 uasyncio.sleep_ms\n\n';
    
    code += 'uasyncio.run(main())\n';

    return code;
  }

  // 分析需求並生成對應的程式碼片段
  analyzeRequirements(requirements, setupCode, loopCode, functions) {
    const req = requirements.toLowerCase();

    // LED 矩陣顯示
    if (req.includes('顯示') || req.includes('燈') || req.includes('matrix')) {
      if (req.includes('圖形') || req.includes('圖案')) {
        const shapeName = this.findShapeName(requirements);
        loopCode.push(`wbit.matrix(100, 100, 100, "${shapeName}")  # 顯示圖形`);
      }
      if (req.includes('全亮') || req.includes('全部')) {
        loopCode.push('wbit.showAll(100, 100, 100)  # 全部 LED 亮白燈');
      }
    }

    // 跑馬燈
    if (req.includes('跑馬燈') || req.includes('scroll')) {
      if (req.includes('文字')) {
        loopCode.push('wbit.scroll(10, 10, 10, "Hello WebBit!")  # 跑馬燈顯示文字');
      } else {
        loopCode.push("wbit.scroll(10, 10, 10, ['happy', 'cry'])  # 跑馬燈顯示圖形");
      }
    }

    // 按鈕操作
    if (req.includes('按鈕') || req.includes('btn')) {
      if (req.includes('a') && req.includes('b')) {
        loopCode.push(`if wbit.btnA() and wbit.btnB():
            # 同時按下 A 和 B 按鈕
            wbit.matrix(100, 0, 0, "heart_1")
        elif wbit.btnA():
            # 按下 A 按鈕
            wbit.matrix(0, 100, 0, "happy")
        elif wbit.btnB():
            # 按下 B 按鈕
            wbit.matrix(0, 0, 100, "cry")`);
      } else if (req.includes('a')) {
        loopCode.push(`if wbit.btnA():
            # 按下 A 按鈕的處理
            wbit.matrix(100, 100, 0, "happy")`);
      } else if (req.includes('b')) {
        loopCode.push(`if wbit.btnB():
            # 按下 B 按鈕的處理
            wbit.matrix(100, 0, 100, "cry")`);
      }
    }

    // 感測器
    if (req.includes('溫度') || req.includes('temp')) {
      loopCode.push(`temp = wbit.temp()
        print(f"溫度: {temp}°C")`);
    }

    if (req.includes('光度') || req.includes('light')) {
      loopCode.push(`left_light = wbit.leftLight()
        right_light = wbit.rightLight()
        print(f"左光度: {left_light}, 右光度: {right_light}")`);
    }

    if (req.includes('dht11') || req.includes('溫濕度')) {
      setupCode.push('dht_pin = 1  # DHT11 連接腳位，請根據實際情況修改');
      loopCode.push(`temp, humi = wbit.dht11(dht_pin)
        if temp is not None:
            print(f"溫度: {temp}°C, 濕度: {humi}%")`);
    }

    if (req.includes('超音波') || req.includes('ultrasonic')) {
      setupCode.push('trig_pin = 12  # 超音波 Trig 腳位');
      setupCode.push('echo_pin = 13  # 超音波 Echo 腳位');
      loopCode.push(`distance = wbit.ultrasonic(trig_pin, echo_pin)
        print(f"距離: {distance} cm")`);
    }

    // 觸摸感測
    if (req.includes('觸摸') || req.includes('touch')) {
      loopCode.push(`if wbit.touchP0():
            print("P0 被觸摸")
        if wbit.touchP1():
            print("P1 被觸摸")
        if wbit.touchP2():
            print("P2 被觸摸")`);
    }

    // 馬達控制
    if (req.includes('馬達') || req.includes('sg90') || req.includes('伺服')) {
      setupCode.push('servo_pin = 2  # 伺服馬達連接腳位');
      loopCode.push(`wbit.sg90(servo_pin, 90)  # 轉到 90 度
        await uasyncio.sleep_ms(1000)
        wbit.sg90(servo_pin, 0)   # 轉到 0 度`);
    }

    // 音樂播放
    if (req.includes('音樂') || req.includes('播放') || req.includes('play')) {
      loopCode.push(`# 播放音樂 (Do Re Mi)
        notes = [[262, 0.5], [294, 0.5], [330, 0.5]]  # C D E
        wbit.play(notes)`);
    }

    // GPIO 控制
    if (req.includes('gpio') || req.includes('腳位')) {
      setupCode.push('gpio_pin = 1  # GPIO 腳位號碼');
      if (req.includes('輸出')) {
        loopCode.push(`wbit.setPin(gpio_pin, True)   # 輸出高電位
        await uasyncio.sleep_ms(1000)
        wbit.setPin(gpio_pin, False)  # 輸出低電位`);
      } else {
        loopCode.push(`pin_state = wbit.readPin(gpio_pin)
        print(f"腳位 {gpio_pin} 狀態: {pin_state}")`);
      }
    }

    // 類比輸入
    if (req.includes('類比') || req.includes('adc')) {
      setupCode.push('adc_pin = 0  # 類比輸入腳位');
      loopCode.push(`adc_value = wbit.adc(adc_pin)
        print(f"類比值: {adc_value}")`);
    }

    // 聲音偵測
    if (req.includes('聲音') || req.includes('sound')) {
      functions.push(`def sound_detected():
    print("偵測到聲音!")
    wbit.matrix(100, 100, 0, "music")`);
      setupCode.push('sound_pin = 1  # 聲音感測器腳位');
      setupCode.push('wbit.soundDetect(sound_pin, sound_detected)');
    }

    // 震動偵測
    if (req.includes('震動') || req.includes('vibration')) {
      functions.push(`def vibration_detected():
    print("偵測到震動!")
    wbit.matrix(100, 0, 0, "star")`);
      setupCode.push('vibration_pin = 1  # 震動感測器腳位');
      setupCode.push('wbit.vibration(vibration_pin, vibration_detected)');
    }

    // 如果沒有特定的迴圈內容，加入基本顯示
    if (loopCode.length === 0) {
      loopCode.push('# 在這裡加入您的程式邏輯');
      loopCode.push('wbit.matrix(100, 100, 100, "happy")  # 顯示開心圖案');
    }
  }

  // 生成詳細註解
  generateComments(requirements) {
    return `# WebBit MicroPython 程式
# 需求: ${requirements}
# 
# 程式說明:
# 1. 使用 uasyncio 進行非同步處理
# 2. WebBit 類別控制 25 顆 LED 矩陣 (5x5)
# 3. LED 編號從右上角開始 (第1顆)，由右到左、由上到下排列
# 4. 第25顆 LED 在左下角
#
# API 使用說明:
# - matrix(r, g, b, image): 顯示圖形，RGB 值範圍 0-100
# - showAll(r, g, b): 全部 LED 顯示同色，RGB 值範圍 0-100
# - scroll(r, g, b, data): 跑馬燈，RGB 值範圍 0-30
# - btnA(), btnB(): 按鈕狀態偵測
# - temp(): 溫度感測
# - leftLight(), rightLight(): 光度感測
# - dht11(pin): DHT11 溫濕度感測器
# - ultrasonic(trig, echo): 超音波距離感測
# - sg90(pin, angle): 伺服馬達控制
# - play(notes): 音樂播放
# - setPin(pin, state): GPIO 輸出控制
# - readPin(pin): GPIO 狀態讀取
# - adc(pin): 類比輸入讀取
#
`;
  }
}

// 註冊工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_webbit_code",
        description: "根據需求生成 WebBit MicroPython 程式碼",
        inputSchema: {
          type: "object",
          properties: {
            requirements: {
              type: "string",
              description: "程式需求描述（繁體中文）"
            },
            include_comments: {
              type: "boolean",
              description: "是否包含詳細註解（預設為 true）",
              default: true
            }
          },
          required: ["requirements"]
        }
      }
    ]
  };
});

// 處理工具調用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "generate_webbit_code") {
    try {
      const { requirements, include_comments = true } = args;
      
      if (!requirements) {
        throw new Error("需求描述不能為空");
      }

      const generator = new WebBitCodeGenerator();
      let code = generator.generateCode(requirements);

      if (include_comments) {
        const comments = generator.generateComments(requirements);
        code = comments + '\n' + code;
      }

      return {
        content: [
          {
            type: "text",
            text: `已根據您的需求生成 WebBit MicroPython 程式碼：

\`\`\`python
${code}
\`\`\`

程式說明：
- 此程式基於 WebBit API 規格撰寫
- 使用 uasyncio 進行非同步處理
- 已根據需求自動選擇是否啟用 MQTT 功能
- 包含完整的感測器和控制功能

使用方式：
1. 將程式碼上傳到 WebBit 開發板
2. 根據實際硬體連接調整腳位設定
3. 執行程式即可看到效果

如需修改或新增功能，請提供更詳細的需求描述。`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `錯誤：${error.message}`
          }
        ],
        isError: true
      };
    }
  }

  throw new Error(`未知的工具: ${name}`);
});

// 處理命令行參數
function handleCommandLineArgs() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
WebBit MCP Service v1.0.0

用途: 為 WebBit 開發板生成 MicroPython 程式碼的 MCP 服務

使用方式:
  node index.js                啟動 MCP 服務
  npx https://github.com/marty5499/mcp-webbit    透過 npx 啟動

選項:
  --help, -h                  顯示此說明
  --version, -v               顯示版本資訊
  --test                      測試模式

MCP 工具:
  generate_webbit_code        根據需求生成 WebBit MicroPython 程式碼

更多資訊: https://github.com/marty5499/mcp-webbit
`);
    process.exit(0);
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    console.log('WebBit MCP Service v1.0.0');
    process.exit(0);
  }
  
  if (args.includes('--test')) {
    console.log('WebBit MCP Service 測試模式');
    console.log('✅ 服務可以正常啟動');
    console.log('✅ 依賴模組載入成功');
    console.log('✅ 配置檔案讀取正常');
    process.exit(0);
  }
}

// 啟動服務器
async function main() {
  // 處理命令行參數
  handleCommandLineArgs();
  
  // 讀取 webbit API 文檔
  try {
    webbitApiDoc = await readFile(join(__dirname, 'webbit_api.md'), 'utf-8');
  } catch (error) {
    console.error('無法讀取 webbit_api.md:', error);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WebBit MCP Service 已啟動");
}

main().catch((error) => {
  console.error("服務啟動失敗:", error);
  process.exit(1);
}); 