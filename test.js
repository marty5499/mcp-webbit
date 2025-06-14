#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFile } from 'fs/promises';

// 測試 MCP 服務
async function testMCPService() {
  console.log('🧪 開始測試 WebBit MCP Service...\n');

  // 檢查必要文件
  try {
    await readFile('./webbit_api.md');
    console.log('✅ webbit_api.md 文件存在');
  } catch (error) {
    console.error('❌ webbit_api.md 文件不存在');
    return;
  }

  try {
    await readFile('./index.js');
    console.log('✅ index.js 文件存在');
  } catch (error) {
    console.error('❌ index.js 文件不存在');
    return;
  }

  try {
    await readFile('./package.json');
    console.log('✅ package.json 文件存在\n');
  } catch (error) {
    console.error('❌ package.json 文件不存在');
    return;
  }

  // 測試範例
  const testCases = [
    {
      name: "基礎 LED 顯示",
      requirements: "顯示開心圖案"
    },
    {
      name: "按鈕控制",
      requirements: "按下按鈕A顯示愛心，按下按鈕B顯示哭臉"
    },
    {
      name: "感測器讀取",
      requirements: "讀取溫度並顯示在螢幕上"
    },
    {
      name: "MQTT 通訊",
      requirements: "接收MQTT訊息並顯示在LED矩陣"
    },
    {
      name: "綜合功能",
      requirements: "按下按鈕A播放音樂，按下按鈕B控制伺服馬達，同時按下AB時讀取DHT11感測器"
    }
  ];

  console.log('測試範例：');
  testCases.forEach((testCase, index) => {
    console.log(`${index + 1}. ${testCase.name}: "${testCase.requirements}"`);
  });

  console.log('\n📝 MCP 工具調用格式範例：');
  console.log('```json');
  console.log(JSON.stringify({
    name: "generate_webbit_code",
    arguments: {
      requirements: testCases[0].requirements,
      include_comments: true
    }
  }, null, 2));
  console.log('```\n');

  console.log('🚀 要測試服務，請執行：');
  console.log('npm start\n');

  console.log('📖 服務功能：');
  console.log('- 智能分析繁體中文需求');
  console.log('- 自動生成完整的 MicroPython 程式');
  console.log('- 支援所有 WebBit API 功能');
  console.log('- 包含詳細的程式註解和說明');
  console.log('- 自動處理 MQTT 設定');
  console.log('- 圖形名稱智能對照');
}

// 執行測試
testMCPService().catch(console.error); 