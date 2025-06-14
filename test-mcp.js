#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// 創建簡化的 MCP server 用於測試
const server = new Server(
  {
    name: "mcp-webbit-test",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 註冊工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("ListTools 請求被調用");
  return {
    tools: [
      {
        name: "test_tool",
        description: "測試工具",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "測試訊息"
            }
          },
          required: ["message"]
        }
      }
    ]
  };
});

// 處理工具調用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error("CallTool 請求被調用:", request.params);
  const { name, arguments: args } = request.params;

  if (name === "test_tool") {
    return {
      content: [
        {
          type: "text",
          text: `測試成功！收到訊息: ${args.message || '無訊息'}`
        }
      ]
    };
  }

  throw new Error(`未知的工具: ${name}`);
});

// 啟動服務器
async function main() {
  try {
    console.error("開始啟動 MCP 測試服務...");
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error("MCP 測試服務已啟動並等待連接");
  } catch (error) {
    console.error("MCP 測試服務啟動失敗:", error);
    process.exit(1);
  }
}

main(); 