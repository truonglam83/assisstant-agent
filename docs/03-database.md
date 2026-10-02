# 03 — Database

> Trạng thái: **Khung**

## 1. Mục tiêu

Schema PostgreSQL (Drizzle ORM), migration, seed. Lưu toàn bộ lịch sử và cấu hình. Thêm agent mới không cần thêm bảng.

## 2. Tham chiếu ý tưởng

- [IDEAS.md](../IDEAS.md) §5 (trí nhớ, ngữ cảnh), §6 (các bảng, `agent_records`)
- [DATABASE.md](DATABASE.md): sơ đồ quan hệ, cột chính, dữ liệu mẫu

## 3. Các phần

### 3.1. Bảng lõi
`agents`, `conversations`, `conversation_sessions`, `messages`, `agent_rules`, `agent_rule_versions`, `memories`

### 3.2. Bảng nghiệp vụ và tích hợp
`agent_records`, `contacts`, `schedules`, `schedule_runs`, `approvals`, `integrations`, `push_subscriptions`

### 3.3. Hạ tầng dữ liệu
- Migration, seed (agent `general`, dữ liệu mẫu cho dev)
- Full-text search cho `messages`
- Mã hoá token trong `integrations`
- Chỗ cho pg-boss (scheduler)

## 4. Cần chốt

- [ ] Nơi chạy Postgres (dev: docker; prod: Supabase / Neon / Railway)
- [ ] Kiểu id (UUID loại nào)
- [ ] Thời gian: lưu `timestamptz`, xử lý múi giờ `Asia/Ho_Chi_Minh` ở đâu
- [ ] Xoá mềm: bảng nào dùng, cách lọc mặc định
- [ ] Cột JSON (`messages.content`, `agents.capabilities`, `agent_records.data`…): format và validate ở đâu
- [ ] Rule: có cột ưu tiên không, xử lý mâu thuẫn giữa các rule
- [ ] Skill của agent lưu thế nào (liên quan 04)
- [ ] Full-text search tiếng Việt: cấu hình, có bỏ dấu không
- [ ] Mã hoá token: thuật toán, xoay khoá
- [ ] Index cần có từ đầu
- [ ] Chiến lược migration (generate hay viết tay), chạy lúc nào khi deploy
- [ ] Dữ liệu seed cho dev (lấy kịch bản trong DATABASE.md?)

## 5. Đã chốt

_(chưa có)_

## 6. Việc cần làm

_(viết sau khi chốt)_
