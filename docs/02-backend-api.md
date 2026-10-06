# 02 — Backend API

> Trạng thái: **Đang làm**
>
> Riêng phần **contract API (mục 3.2, 3.3)** phải chốt **trước khi làm FE**.

## 1. Mục tiêu

Backend NestJS phục vụ mọi client qua REST + SSE: xác thực, CRUD dữ liệu, stream chat, duyệt hành động, kết nối dịch vụ ngoài.

## 2. Tham chiếu ý tưởng

- [IDEAS.md](../IDEAS.md) §2 (nguyên tắc), §3 (công nghệ), §4 (kiến trúc), §7 (luồng chính), §9 (bảo mật), §10 (biến môi trường), §12 (bẫy đã biết)

## 3. Các phần

### 3.1. Nền tảng

- Khởi tạo NestJS, cấu trúc Module / Controller / Service
- Xác thực mọi request (token từ FE), chỉ cho phép một email
- CORS: chỉ nhận request từ domain frontend
- Validate input, định dạng lỗi thống nhất
- Log

### 3.2. Contract REST (theo nhóm)

- Agents: danh sách, chi tiết, tạo, sửa, xoá
- Conversations / messages: lấy luồng chat, phân trang tin cũ, đánh dấu đã đọc
- Rules: danh sách, thêm, sửa, bật/tắt, xoá, lịch sử, khôi phục
- Memories: danh sách, sửa, xoá, ghim
- Schedules / schedule runs
- Approvals: danh sách, duyệt, từ chối
- Contacts
- Integrations: kết nối / ngắt Gmail (OAuth)
- Push subscriptions
- Thống kê chi phí
- Danh mục tool và skill có sẵn (cho popup tạo agent)

### 3.3. Contract SSE (stream chat)

- Gửi tin nhắn và nhận stream
- Các loại sự kiện: chữ, tool bắt đầu/kết thúc, yêu cầu duyệt, gợi ý agent, đề xuất sửa rule, đã ghi nhớ, kết thúc lượt (token, chi phí), lỗi
- Tin `event` do lịch đăng vào lúc người dùng đang mở app

### 3.4. Kết nối dịch vụ ngoài

- Gmail OAuth: đổi code lấy token, lưu mã hoá, làm mới token
- Web Push: gửi thông báo

## 4. Cần chốt

- [ ] Cách định nghĩa contract dùng chung FE–BE (schema chung, OpenAPI, hay type thuần)
- [ ] Token giữa FE và BE: loại token, cách cấp, thời hạn
- [ ] Danh sách endpoint và quy ước đặt tên
- [ ] Danh sách sự kiện SSE và format từng sự kiện
- [ ] Mất kết nối SSE giữa lượt: agent chạy tiếp không, FE lấy lại kết quả thế nào
- [ ] Nhận tin mới khi không đang chat (tin `event` lúc 7h): SSE thường trực, polling hay chỉ push
- [ ] Phân trang tin nhắn
- [ ] Định dạng lỗi
- [ ] Luồng duyệt: API duyệt/từ chối tiếp tục lượt agent đang chờ thế nào (liên quan 04)
- [ ] Giới hạn: kích thước tin nhắn, số request

## 5. Đã chốt

- **Framework Backend**: Chọn **NestJS** làm framework chính. Cấu trúc theo kiến trúc Module/Controller/Service, Dependency Injection, class-validator DTO, và native `@Sse()` cho streaming chat SSE. _(2026-10-05)_
- **Lấy 1 agent theo slug: BE tự tra** — route riêng `GET /agents/:slug`, BE query thẳng `WHERE slug = :slug` và trả về 1 agent (kèm `id` thật). Không dùng cách "FE gọi `GET /agents` lấy hết rồi tự lọc theo slug". _(2026-09-27)_
- **Contract Rules API & DTOs**:
  - `GET /agents/:agentId/rules`: Lấy danh sách rules của 1 agent (hỗ trợ cả UUID hoặc `slug`).
  - `POST /agents/:agentId/rules`: Thêm rule mới cho agent (khởi tạo `version = 1`, tạo snapshot đầu tiên trong `agent_rule_versions`).
  - `PATCH /rules/:id`: Cập nhật rule (nếu thay đổi `content`, tự động tăng `version` và lưu snapshot vào `agent_rule_versions`).
  - `DELETE /rules/:id`: Xóa mềm rule (`deleted_at`).
  - `GET /rules/:id/versions`: Xem lịch sử các phiên bản của rule.
  - **Ràng buộc nghiệp vụ**: Mỗi agent phải có ít nhất 1 rule đang bật (`enabled = true`). Backend từ chối xóa hoặc tắt rule đang hoạt động cuối cùng của agent.
  - **DTO Agent**: Nhận `canDo` và `cannotDo` từ Frontend, map vào cột `capabilities: { can, cannot }`. Cho phép sửa/xoá agent theo cả `id` (UUID) hoặc `slug`. _(2026-10-05)_
- **Auth Guard BE & Token FE-BE**: FE (Auth.js v5) nhúng `apiToken` (JWT HS256 được ký bằng `AUTH_SECRET`) vào session. Cả Server Component và Client Component gửi token qua header `Authorization: Bearer <apiToken>`. BE dùng `jose` (`jwtVerify`) để xác thực token bằng `AUTH_SECRET`, đối chiếu `payload.email === ALLOWED_EMAIL`, và gán `req.user = payload`. Guard áp dụng global cho toàn bộ endpoint (trừ `GET /api/health`). Cung cấp endpoint `GET /api/auth/me` để kiểm tra và xác nhận trạng thái đăng nhập giữa FE và BE. _(2026-10-05)_


## 6. Việc cần làm

- [ ] Khởi tạo dự án NestJS base trong thư mục `api/` (Express platform, TypeScript)
- [ ] Thiết lập Global ValidationPipe (`class-validator`, `class-transformer`), CORS, Health Controller (`/api/health`)
- [ ] Xây dựng ChatController với SSE Stream endpoint (`/api/chat/stream`)
- [ ] Viết tài liệu hướng dẫn chi tiết về cấu trúc NestJS trong `api/README.md`
