// Helper dùng chung cho mọi module trong lib/api/* (agents, rules, schedules…).
//
// `endpoint` rỗng ("", xem endpoints.ts) → chưa có backend thật, chạy `mock()`
// thay vì gọi mạng. Điền endpoint xong thì tự chuyển sang gọi `fetch` thật —
// nơi gọi (agentsApi.create, popup…) không cần đổi gì.

const DEFAULT_API_BASE = "http://localhost:3001/api";

async function getApiToken(): Promise<string | undefined> {
  try {
    if (typeof window === "undefined") {
      const { auth } = await import("@/auth");
      const session = await auth();
      return session?.apiToken;
    }

    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    return session?.apiToken;
  } catch {
    return undefined;
  }
}

function resolveUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const base =
    (typeof window === "undefined"
      ? process.env.INTERNAL_API_URL
      : undefined) ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_API_BASE;

  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = endpoint.replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
}

export async function callApi<T>(
  endpoint: string,
  init: RequestInit,
  mock: () => Promise<T>,
): Promise<T> {
  if (!endpoint) {
    return mock();
  }

  const url = resolveUrl(endpoint);
  const token = await getApiToken();

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...init,
    headers,
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
