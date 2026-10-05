import { ENDPOINTS } from "./endpoints";
import { callApi } from "./http";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const integrationsApi = {
  // Kết nối là một redirect OAuth, không phải gọi API JSON bình thường — nên
  // hàm này điều hướng cả trang khi có endpoint thật, thay vì fetch.
  connect(): void {
    if (ENDPOINTS.CONNECT_GMAIL) {
      window.location.href = ENDPOINTS.CONNECT_GMAIL;
      return;
    }
    console.info("[mock integrationsApi.connect] chưa có endpoint — chưa redirect OAuth thật.");
  },

  async disconnect(): Promise<void> {
    return callApi(ENDPOINTS.DISCONNECT_GMAIL, { method: "DELETE" }, async () => {
      console.info("[mock integrationsApi.disconnect]");
      await delay(300);
    });
  },
};
