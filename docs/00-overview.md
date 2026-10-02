# Detail docs — Tổng quan

Mục lục các detail doc, thứ tự làm, trạng thái và nhật ký quyết định.

## Mục lục

| # | File | Mảng | Trạng thái |
|---|---|---|---|
| 01 | [01-frontend.md](01-frontend.md) | Next.js, giao diện, mock API | Đang làm |
| 02 | [02-backend-api.md](02-backend-api.md) | Hono, contract REST + SSE, auth | Khung |
| 03 | [03-database.md](03-database.md) | PostgreSQL, Drizzle, migration | Khung |
| 04 | [04-agent.md](04-agent.md) | Agent SDK, tool, rule, skill, trí nhớ, lịch, tích hợp | Khung |
| 05 | [05-infra.md](05-infra.md) | Monorepo, Docker, env, deploy | Khung |

Trạng thái: **Khung** (mới có mục lục + câu hỏi) → **Đang chốt** → **Đã chốt** → **Đang làm** → **Xong**.

## Thứ tự làm

1. **Repo tối thiểu** (05, chỉ phần repo): tạo 2 repo riêng (`web`, `api`), chạy được `web`. **Chưa đụng Docker deploy, CI, hosting.**
2. **Frontend** (01): dựng toàn bộ UI, gọi **mock API theo contract**.
   - Contract API (REST + SSE) nằm ở 02 nhưng **phải chốt trước khi làm FE**, vì FE mock theo đúng contract đó.
3. **Backend + Database** (02 + 03, làm chung): hiện thực contract và viết schema song song — route cần bảng để test, không tách rời hoàn toàn.
   - **Docker Postgres chạy local setup ngay khi bắt đầu code phần này**, không đợi tới bước 5. Đây là môi trường dev, khác với infra deploy production.
   - FE chỉ đổi URL từ mock sang API thật khi xong.
4. **Agent** (04): cắm Claude Agent SDK thật vào BE đã có ở bước 3.
5. **Infra deploy** (05, phần còn lại): Docker production, CI, Railway/VPS, domain. **Làm cuối cùng.**

## Cấu trúc mỗi detail doc

1. **Mục tiêu**: mảng này làm gì.
2. **Tham chiếu ý tưởng**: mục liên quan trong [IDEAS.md](../IDEAS.md).
3. **Các phần**: danh sách việc thuộc mảng.
4. **Cần chốt**: các câu hỏi phải quyết định cùng nhau trước khi code.
5. **Đã chốt**: ghi lại quyết định (trống cho đến khi chốt).
6. **Việc cần làm**: checklist, viết sau khi chốt.

## Nhật ký quyết định

| Ngày | Mảng | Quyết định | Lý do |
|---|---|---|---|
| 2026-09-27 | Chung | Chia detail docs theo mảng: FE, BE-API, Database, Agent, Infra | Làm theo thứ tự FE → BE → DB → Agent |
| 2026-09-27 | FE | FE làm trước, chạy với mock API theo contract | Không phải chờ BE; khi có BE chỉ đổi URL |
| 2026-09-27 | Chung | Thứ tự cụ thể: repo tối thiểu → FE (mock) → BE+DB chung → Agent → infra deploy (cuối cùng) | Route BE cần bảng để test, không tách rời BE và DB; đây là project để học, deploy thật để cuối cho đỡ rối |
| 2026-09-27 | BE/Infra | Docker Postgres local setup ngay khi bắt đầu code BE, không đợi tới bước infra deploy | BE không test được nếu không có DB thật; đây là môi trường dev, khác infra production |
| 2026-09-27 | Infra | Bỏ ý tưởng monorepo/pnpm workspaces, dùng 2 repo riêng (web, api) | Lợi ích duy nhất là chia sẻ type FE/BE, không đủ quan trọng để đánh đổi thêm khái niệm workspace lúc mới học |
| 2026-09-27 | FE | Auth.js v5 + Google, `ALLOWED_EMAIL`, Tailwind v4, design token lấy từ mockup, route agent `/agents/[slug]` (+ `/rules`) | Xong khung đăng nhập + Chat chung, đang sang trang agent |
| 2026-09-27 | FE | Bỏ PWA (manifest, cài vào màn hình chính) khỏi mảng FE | Deploy xong dùng qua trình duyệt trên điện thoại là đủ, không cần "cài như app". Service Worker cho Web Push dời qua làm cùng Backend/Agent (cần `VAPID_PRIVATE_KEY` + `push_subscriptions` ở server) |
| 2026-09-27 | FE | Bỏ trang "Lịch & duyệt" và "Trí nhớ" dạng global, dồn vào tab riêng của từng agent (Chat/Rule/Lịch/Trí nhớ). Chi phí thì giữ 2 nơi: trang global `/costs` (tổng) và tab Lịch của agent (riêng agent đó). Hồ sơ chung (không thuộc agent nào) chuyển vào tab Trí nhớ của Chat chung | `schedules`/ghi nhớ riêng đều gắn `agent_id`, không có khái niệm "chung"; thẻ duyệt vốn đã hiện trong chat của agent nên trang duyệt riêng bị trùng. Chi phí là thứ hợp lý so sánh *giữa* các agent nên giữ lại tầng chung |
| 2026-10-03 | FE | Đồng bộ danh sách Agent ở Sidebar tức thì qua `AgentModalProvider` + `SidebarAgentsList`; Render Markdown cho câu trả lời của trợ lý (in đậm, danh sách, link, code block có nút sao chép) | Giải quyết vấn đề cập nhật dữ liệu client-side không cần reload trang; hoàn thiện trải nghiệm đọc và tương tác tin nhắn chat AI |
