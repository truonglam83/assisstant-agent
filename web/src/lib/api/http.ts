// Helper dùng chung cho mọi module trong lib/api/* (agents, rules, schedules…).
//
// `endpoint` rỗng ("", xem endpoints.ts) → chưa có backend thật, chạy `mock()`
// thay vì gọi mạng. Điền endpoint xong thì tự chuyển sang gọi `fetch` thật —
// nơi gọi (agentsApi.create, popup…) không cần đổi gì.

export async function callApi<T>(
  endpoint: string,
  init: RequestInit,
  mock: () => Promise<T>,
): Promise<T> {
  if (!endpoint) {
    return mock();
  }

  const res = await fetch(endpoint, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API lỗi ${res.status}${text ? `: ${text}` : ""}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
