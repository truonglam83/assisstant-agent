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

## 6. Việc cần làm

- [ ] Khởi tạo dự án NestJS base trong thư mục `api/` (Express platform, TypeScript)
- [ ] Thiết lập Global ValidationPipe (`class-validator`, `class-transformer`), CORS, Health Controller (`/api/health`)
- [ ] Xây dựng ChatController với SSE Stream endpoint (`/api/chat/stream`)
- [ ] Viết tài liệu hướng dẫn chi tiết về cấu trúc NestJS trong `api/README.md`
