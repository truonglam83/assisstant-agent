// Endpoint API thật — điền khi có backend (theo contract docs/02-backend-api.md).
// ĐỂ TRỐNG ("") NGHĨA LÀ CHƯA CÓ: các hàm trong lib/api/* sẽ tự dùng dữ liệu giả
// (mock) thay vì gọi mạng. Điền xong một dòng thì API tương ứng tự chạy thật,
// không cần sửa gì ở component hay ở các hàm gọi API.

export const ENDPOINTS = {
  // Agents (docs/02-backend-api.md §3.2 "Agents")
  LIST_AGENTS: "/agents", // GET — cho Sidebar
  GET_AGENT_BY_SLUG: "/agents/:slug", // GET — BE tự tra theo slug
  CREATE_AGENT: "/agents", // POST
  UPDATE_AGENT: "/agents", // PATCH /agents/:slug
  DELETE_AGENT: "/agents", // DELETE /agents/:slug

  // Rules (§3.2 "Rules")
  LIST_RULES: "/agents/:agentId/rules", // GET
  CREATE_RULE: "/agents/:agentId/rules", // POST
  UPDATE_RULE: "/rules", // PATCH /rules/:id
  DELETE_RULE: "/rules", // DELETE /rules/:id
  GET_RULE_VERSIONS: "/rules/:id/versions", // GET

  // Approvals (§3.2 "Approvals")
  LIST_PENDING_APPROVALS: "", // ví dụ: "/agents/:agentId/approvals" (GET, ?status=pending)
  DECIDE_APPROVAL: "", // ví dụ: "/approvals" (POST /approvals/:id/decide — hàm tự nối thêm /:id/decide)

  // Schedules (§3.2 "Schedules / schedule runs")
  LIST_SCHEDULES: "", // ví dụ: "/agents/:agentId/schedules" (GET)
  LIST_SCHEDULE_RUNS: "", // ví dụ: "/agents/:agentId/schedule-runs" (GET)
  TOGGLE_SCHEDULE: "", // ví dụ: "/schedules" (PATCH /schedules/:id — hàm tự nối thêm /:id)

  // Memories (§3.2 "Memories")
  LIST_MEMORIES: "", // ví dụ: "/agents/:agentId/memories" (GET)
  LIST_SHARED_MEMORIES: "", // ví dụ: "/memories?shared=1" (GET — hồ sơ chung, không thuộc agent nào)
  UPDATE_MEMORY: "", // ví dụ: "/memories"   (PATCH /memories/:id — hàm tự nối thêm /:id)
  DELETE_MEMORY: "", // ví dụ: "/memories"   (DELETE /memories/:id — hàm tự nối thêm /:id)

  // Chi phí (IDEAS.md §5.5)
  GET_TOTAL_COST: "", // ví dụ: "/costs" (GET — tổng mọi agent)
  GET_AGENT_COST: "", // ví dụ: "/agents/:agentId/cost" (GET — chỉ agent này)

  // Integrations (§3.2 "Integrations")
  CONNECT_GMAIL: "", // ví dụ: "/integrations/google/connect"
  DISCONNECT_GMAIL: "", // ví dụ: "/integrations/google"       (DELETE)

  // Messages (§3.2 "Conversations / messages", §3.3 SSE)
  LIST_MESSAGES: "", // ví dụ: "/conversations/:key/messages"  (GET, phân trang bằng ?before=)
  SEND_MESSAGE: "", // ví dụ: "/conversations/:key/messages"   (POST) — sau này thay bằng SSE, xem 02-backend-api §3.3
};
