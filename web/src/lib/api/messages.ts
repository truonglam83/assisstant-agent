import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";
import { getMockMessagePage, type MockMessage } from "@/lib/mock/messages";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type MessagePage = { messages: MockMessage[]; hasMore: boolean };

export const messagesApi = {
  // Lấy 1 trang tin nhắn. Không truyền `beforeId` = trang mới nhất (mới vào
  // luồng chat). Có `beforeId` = tải tiếp tin cũ hơn tin đó (lazy load khi
  // lướt lên đầu). TODO: khi có SSE thật (docs/02-backend-api.md §3.3), tin
  // nhắn mới sẽ đến qua stream thay vì gọi lại hàm này.
  async list(conversationKey: string, beforeId?: string): Promise<MessagePage> {
    const endpoint = ENDPOINTS.LIST_MESSAGES
      ? `${ENDPOINTS.LIST_MESSAGES.replace(":key", conversationKey)}${beforeId ? `?before=${beforeId}` : ""}`
      : "";
    return callApi(endpoint, { method: "GET" }, async () => {
      await delay(350); // giả lập độ trễ mạng để thấy rõ trạng thái "đang tải"
      return getMockMessagePage(conversationKey, beforeId);
    });
  },

  async send(conversationKey: string, content: string): Promise<MockMessage> {
    const endpoint = ENDPOINTS.SEND_MESSAGE
      ? ENDPOINTS.SEND_MESSAGE.replace(":key", conversationKey)
      : "";
    return callApi(
      endpoint,
      { method: "POST", body: JSON.stringify({ content }) },
      async () => {
        console.log("[mock messagesApi.send]", conversationKey, content);
        await delay(150);
        return { id: `local_${Date.now()}`, role: "user", content } as MockMessage;
      },
    );
  },
};
