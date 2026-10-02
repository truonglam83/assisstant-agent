# 01 — Frontend

> Trạng thái: **Đang làm**

## 1. Mục tiêu

Dựng toàn bộ giao diện web, **dùng được trên điện thoại qua trình duyệt** (responsive, không cần cài như app), chạy được **trước khi có backend** bằng mock API theo đúng contract ở [02-backend-api](02-backend-api.md).

## 2. Tham chiếu ý tưởng

- [IDEAS.md](../IDEAS.md) §1 (chat chung, agent, tạo agent), §4 (kiến trúc), §5.3d (trang Trí nhớ), §5.6 (tab Rule), §7 (luồng chính), §9 (đăng nhập)
- [ui-mockup.html](ui-mockup.html): Chat chung, agent · Chat, agent · Rule, popup tạo agent, điện thoại

## 3. Các phần

### 3.1. Khung app
- Layout: sidebar (Chat chung, Agents, + New agent, Chi phí, Cài đặt, người dùng) + vùng nội dung
- Điều hướng trên điện thoại (menu trượt)
- Đăng nhập Google, chặn email không được phép

### 3.2. Màn hình
- Chat chung: tab **Chat** | tab **Trí nhớ** (chỉ hồ sơ chung, không thuộc agent nào)
- Trang agent: tab **Chat** | **Rule** | **Lịch** (lịch chạy + chờ duyệt + chi phí riêng agent) | **Trí nhớ** (riêng agent), nút ⚙️ sửa agent
- Popup tạo / sửa agent, xoá agent
- Chi phí (global, tổng mọi agent)
- Kết nối dịch vụ (Gmail…)

### 3.3. Thành phần chat
- Ô nhập, gửi, stream câu trả lời
- Hiển thị markdown
- Trạng thái tool đang chạy
- Các thẻ: gợi ý agent ("Mở agent"), xem trước mail, duyệt hành động, kết quả lịch (tin `event`), đề xuất sửa rule, "Đã ghi nhớ"
- Mốc ngày, tin chưa đọc, tải thêm tin cũ

### 3.4. Mock API
- Mock REST + SSE theo contract
- Dữ liệu mẫu theo kịch bản trong [DATABASE.md](DATABASE.md) §3

### 3.5. ~~PWA~~ — bỏ khỏi mảng FE, xem "Đã chốt"

## 4. Cần chốt

- [x] ~~Cách quản lý dữ liệu từ server và state phía client~~ — **đã chốt**: `AgentModalProvider` quản lý state `agents`, `SidebarAgentsList` subscribe để tự re-render tức thì khi tạo/sửa/xoá agent mà không cần tải lại trang.
- [ ] Cách nhận SSE (thư viện hay tự viết), xử lý mất kết nối giữa chừng
- [ ] Công cụ mock API
- [ ] Auth phía FE: Auth.js cấp token cho backend thế nào (liên quan 02)
- [ ] Dark mode: có hay không, lúc nào
- [ ] Ngôn ngữ giao diện: chỉ tiếng Việt hay chuẩn bị i18n
- [ ] Test: mức nào (component, e2e) và công cụ gì
- [ ] **Mới phát sinh:** Lịch & duyệt và Trí nhớ không có trong `ui-mockup.html` (mockup chỉ có 5 màn: Chat chung, agent Chat, agent Rule, popup tạo agent, điện thoại) — cần tự thiết kế theo mô tả ở `IDEAS.md` §6, §5.3d, không có ảnh mẫu để bám

## 5. Đã chốt

- **Styling: Tailwind CSS v4** (theme qua `@theme inline` trong `globals.css`, không dùng `tailwind.config.js`). *(2026-09-27)*
- **Design token**: lấy đúng màu/font từ `docs/ui-mockup.html` (nền `#F4F2EC`, sidebar `#ECE9E1`, accent `#2F5D50`, font Be Vietnam Pro + Fraunces qua `next/font/google`). Chỉ làm light mode, dark mode vẫn chưa chốt. *(2026-09-27)*
- **Repo `web` nằm trong thư mục con `web/`** của project này, là repo git riêng (không phải monorepo). *(2026-09-27)*
- **"Footer" của mỗi màn hình chat = thanh nhập tin nhắn cố định cuối khung chat**, không phải footer riêng. *(2026-09-27)*
- **Auth**: Auth.js v5 (`next-auth@beta`), provider Google, chỉ cho phép email trong `ALLOWED_EMAIL` (`truonglam83.dev@gmail.com`) qua callback `signIn`. Chặn truy cập mọi route (trừ `/login`, `/api/auth/*`) bằng `src/proxy.ts` (Next.js 16 đổi tên quy ước file từ `middleware.ts` thành `proxy.ts`). *(2026-09-27)*
- **Lỗi đăng nhập** (`AccessDenied`…) redirect về `/login` (`pages.error` trong `auth.ts`), hiện banner đỏ ngay trong khung đăng nhập thay vì trang lỗi mặc định của Auth.js. Thêm token màu `danger` (không có trong mockup, tự thêm cho hợp tông). *(2026-09-27)*
- **Cấu trúc route agent**: `/agents/[slug]` = tab Chat (mặc định), `/agents/[slug]/rules` = Rule, `/agents/[slug]/schedules` = Lịch, `/agents/[slug]/memories` = Trí nhớ riêng. Header + 4 tab dùng chung một layout (`agents/[slug]/layout.tsx`). *(2026-09-27, cập nhật)*
- **Bỏ trang "Lịch & duyệt" và "Trí nhớ" dạng global**, dồn vào agent: `schedules.agent_id` và ghi nhớ riêng agent (theo `DATABASE.md`) vốn đã thuộc về 1 agent cụ thể, không có khái niệm "chung" — quản lý tốt hơn khi nằm ngay trong agent đó, cạnh tab Rule. Thẻ duyệt cũng đã hiện sẵn trong luồng chat của agent (theo `IDEAS.md`), nên trang duyệt riêng bị trùng lặp. *(2026-09-27)*
- **Chi phí**: có **cả 2 nơi**. Trang global `/costs` (Sidebar) = **tổng mọi agent**. Tab "Lịch" của từng agent = **chỉ chi phí của agent đó**. Lý do: chi phí là thứ hợp lý để so sánh *giữa* các agent (như Chat chung là "tầng chung"), khác với lịch/duyệt/ghi nhớ vốn không có ý nghĩa gì khi tách khỏi agent. *(2026-09-27)*
- **Trí nhớ chia theo đúng data model**: hồ sơ chung (`memories.agent_id` trống, mọi agent đọc được) → tab "Trí nhớ" của **Chat chung**. Ghi nhớ riêng (`agent_id` = agent đó) → tab "Trí nhớ" của **agent đó**. Không còn trang `/memories` gộp chung cả hai như trước. *(2026-09-27)*
- **Chat chung cũng có layout dạng tab** (`(app)/(general)/layout.tsx`, route group không đổi URL): tab Chat ở `/`, tab Trí nhớ ở `/memories`. *(2026-09-27)*
- **Thứ tự dựng màn hình**: Chat chung ✅ → trang agent (Chat + Rule) ✅ → popup tạo/sửa agent ✅ → Lịch & duyệt (gồm luôn Chi phí) ✅ → Trí nhớ ✅ → Kết nối dịch vụ (Gmail) ✅ → **responsive điện thoại**. Hết — không còn PWA trong mảng FE. *(2026-09-27, cập nhật)*
- **Bỏ PWA khỏi mảng FE** (manifest, "cài vào màn hình chính"): chủ dự án xác nhận không cần trải nghiệm "cài như app", deploy xong dùng thẳng qua trình duyệt trên điện thoại — responsive là đủ. Phần Service Worker cho **Web Push** dời qua làm cùng Backend/Agent (Phase 4 của `IDEAS.md`), vì push cần `VAPID_PRIVATE_KEY` và bảng `push_subscriptions` ở server, không làm được thuần FE. *(2026-09-27)*
- **Lịch & duyệt, Trí nhớ, Kết nối dịch vụ không có trong `ui-mockup.html`** (mockup chỉ có 5 màn liệt kê ở §2) — tự thiết kế theo mô tả trong `IDEAS.md`, giữ nguyên token màu/font/spacing đã dùng, không phác thảo riêng trước. *(2026-09-27)*
- **Kết nối dịch vụ (Gmail)** đặt ở trang riêng `/settings` (không có trong mô tả sidebar gốc của `IDEAS.md`) — tự thêm mục "Cài đặt" vào cuối Sidebar vì phải có chỗ bấm vào. *(2026-09-27)*
- **Trước khi có mock API (3.4)**: các màn hình dùng dữ liệu mẫu hardcode ngay trong component (theo đúng dữ liệu mẫu trong `DATABASE.md` §3), đánh dấu `// TODO: thay bằng mock API` để dễ tìm và thay sau. *(2026-09-27)*
- **"Constant API" cho chỗ có submit**: gom các hàm gọi API (còn là stub) vào 1 file theo mảng, ví dụ `src/lib/api/agents.ts` cho popup agent (`agentsApi.create/update/remove`). Component chỉ gọi hàm, không tự biết chi tiết gọi thế nào. *(2026-09-27)*
- **Endpoint để trống trong `src/lib/api/endpoints.ts`** (`CREATE_AGENT`, `UPDATE_AGENT`, `DELETE_AGENT`…), chủ dự án tự điền khi có backend/contract thật. Helper dùng chung `src/lib/api/http.ts` (`callApi`): endpoint rỗng thì tự chạy mock (log console + delay giả), điền endpoint xong thì tự chuyển sang gọi `fetch` thật — **chỉ sửa `endpoints.ts`, không sửa UI lẫn `agents.ts`**. Áp dụng mẫu này cho các module `lib/api/*` sau này (rules, schedules…). *(2026-09-27)*
- **Popup = modal client-side (Context), không phải route riêng**: `AgentModalProvider` đặt ở gốc layout `(app)`, mở bằng `useAgentModal()`. Đồng bộ state danh sách agent: `AgentModalProvider` nắm `agents` và hàm `refreshAgents`, `SidebarAgentsList` subscribe để tự cập nhật danh sách ngay khi tạo/sửa/xoá mà không cần F5 trang. *(2026-10-03, cập nhật)*
- **Render Markdown trong khung chat**: dùng `marked.lexer` bóc tách AST và render sang React component (`MarkdownContent`). Hỗ trợ in đậm/nghiêng, inline code, link, bullet/numbered list, table, và code block có thanh tiêu đề + nút Sao chép (copy) kèm Toast. *(2026-10-03)*
- **`src/components/` chia thư mục con theo tính năng**, không để phẳng: `ui/` (Dialog, ConfirmDialog, ToggleSwitch, NavLink, ToastProvider — dùng lại được, không gắn tính năng cụ thể), `layout/` (Sidebar và mọi thứ quanh nó), `chat/`, `agents/`, `memories/`, `integrations/`, `costs/`. Component mới thêm sau này xếp đúng thư mục theo tính năng, hoặc `ui/` nếu là thứ dùng chung. `src/lib/mock-*.ts` cũng gom vào `lib/mock/` (song song với `lib/api/`), bỏ tiền tố `mock-` trong tên file vì thư mục đã nói rõ. *(2026-09-27)*
- **Tách rõ `id` và `slug` của agent**, đúng `DATABASE.md`: `id` (thực tế là UUID, ở mock dùng `ag_mail` cho dễ đọc) là khoá thật để join dữ liệu (schedules, memories, rules, chi phí đều tham chiếu `agentId`); `slug` (`mail-action`) CHỈ để đẹp URL, không dùng để lọc/join dữ liệu. *(2026-09-27)*
- **Mỗi tab của agent (Rule/Lịch/Trí nhớ) là 1 "view" component nhận `agentId`**, tự gọi API (mock) lấy dữ liệu — `AgentRulesView`, `AgentSchedulesView`, `AgentMemoriesView` (đều trong `components/agents/`). `page.tsx` chỉ còn việc: resolve `slug` → `agent.id` rồi render component đó — không còn lọc mảng mock trực tiếp trong file trang. Thêm lớp đọc dữ liệu (`rulesApi.list`, `schedulesApi.list/listRuns`, `approvalsApi.listPending`, `memoriesApi.list/listShared`, `costsApi.getTotal/getForAgent`) theo đúng "constant API" đã có (endpoint để trống ở `endpoints.ts`). Tab Trí nhớ của agent và tab Trí nhớ của Chat chung dùng chung 1 component trình bày `MemoryList`, chỉ khác nguồn dữ liệu gọi vào. *(2026-09-27)*
- **Resolve slug → agent: BE tự tra theo slug** (route riêng `GET /agents/:slug`), không phải FE tải hết `GET /agents` rồi tự lọc — xem `02-backend-api.md` "Đã chốt". Toàn bộ nơi cần "1 agent theo slug" đều gọi `agentsApi.getBySlug(slug)`, không còn nơi nào gọi thẳng `getMockAgent`/`MOCK_AGENTS` trừ bên trong `lib/api/agents.ts`. Sidebar cũng đổi sang `agentsApi.list()`. Tin nhắn (`ChatThread`/`mock/messages.ts`) đổi khoá từ slug sang `agentId`, đồng bộ với schedules/memories/rules/chi phí. *(2026-09-27)*

## 6. Việc cần làm

- [x] Scaffold Next.js (TypeScript, App Router, Tailwind, ESLint) trong `web/`
- [x] Auth.js v5 + Google provider, giới hạn `ALLOWED_EMAIL`
- [x] Trang `/login`
- [x] Chặn route chưa đăng nhập bằng `proxy.ts`, redirect qua lại `/login` ↔ `/`
- [x] Design token (màu, font) trong `globals.css` theo mockup
- [x] Sidebar (khung điều hướng), trang Chat chung với header + thanh nhập tin nhắn (footer)
- [x] OAuth client Google Cloud Console tạo xong, đăng nhập chạy được
- [x] Lỗi đăng nhập hiện đúng trong UI (banner ở `/login`), không còn trang lỗi mặc định
- [x] Trang agent `mail-action` — tab Chat + tab Rule (`/agents/[slug]`, `/agents/[slug]/rules`), dữ liệu rule hardcode theo `DATABASE.md` §3
- [x] Popup tạo/sửa agent + xác nhận xoá (modal client-side, `agentsApi` stub trong `src/lib/api/agents.ts`)
- [x] ~~Trang Lịch & duyệt global (`/schedules`)~~ — **dọn lại**: chuyển vào tab "Lịch" của từng agent (`/agents/[slug]/schedules`): chờ duyệt, danh sách lịch (bật/tắt), lịch sử chạy, chi phí riêng agent đó
- [x] ~~Trang Trí nhớ gộp chung (`/memories`)~~ — **dọn lại**: hồ sơ chung → tab "Trí nhớ" của Chat chung (`/memories`, vẫn URL này nhưng giờ chỉ chứa hồ sơ chung); ghi nhớ riêng agent → tab "Trí nhớ" của agent (`/agents/[slug]/memories`)
- [x] Trang **Chi phí** global (`/costs`): tổng mọi agent — thay thế mục Sidebar "Lịch & duyệt" cũ
- [x] Trang **Cài đặt** (`/settings`): kết nối/ngắt Gmail — thêm mới, không có trong sidebar gốc của IDEAS.md
- [x] Mở rộng "constant API": `lib/api/approvals.ts`, `schedules.ts`, `memories.ts`, `integrations.ts` (cùng mẫu `ENDPOINTS` + `callApi` như agents)
- [x] Mock data tin nhắn (`lib/mock-messages.ts`) + `lib/api/messages.ts` (`list` phân trang, `send`). Component `ChatThread` dùng chung cho Chat chung và mọi trang agent: tải trang mới nhất khi vào, **lazy-load khi lướt gần lên đầu** (giữ nguyên vị trí scroll), Enter gửi / Shift+Enter xuống dòng
- [x] Responsive điện thoại (sidebar drawer trượt mượt mà cho màn hẹp)
- [x] Render Markdown cho tin nhắn (bold, italic, list, inline code, link, code block có nút sao chép)
- [x] Tự cập nhật Sidebar tức thì khi tạo / sửa / xoá agent (State synchronization)
- [ ] Các thẻ tương tác đặc thù trong chat (Mở agent, xem trước mail, duyệt tại chat, đề xuất rule, tool call)
- [ ] Mock API theo contract — chuẩn bị sang bước Backend (02)
