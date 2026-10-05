# 03 — Database

> Trạng thái: **Đang làm**

## 1. Mục tiêu

Schema PostgreSQL (TypeORM), migration, seed. Lưu toàn bộ lịch sử và cấu hình. Thêm agent mới không cần thêm bảng.

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

- [x] Nơi chạy Postgres (dev: docker local; prod: Supabase / Neon / Railway)
- [x] ORM kết nối: TypeORM (`@nestjs/typeorm` + `pg`)
- [x] Kiểu id: UUID (v4)
- [ ] Thời gian: lưu `timestamptz`, xử lý múi giờ `Asia/Ho_Chi_Minh` ở đâu
- [ ] Xoá mềm: bảng nào dùng, cách lọc mặc định (`deleted_at`)
- [ ] Cột JSON (`messages.content`, `agents.capabilities`, `agent_records.data`…): format và validate ở đâu
- [ ] Rule: có cột ưu tiên không, xử lý mâu thuẫn giữa các rule
- [ ] Skill của agent lưu thế nào (liên quan 04)
- [ ] Full-text search tiếng Việt: cấu hình, có bỏ dấu không
- [ ] Mã hoá token: thuật toán, xoay khoá
- [ ] Index cần có từ đầu
- [ ] Chiến lược migration (generate hay synchronize khi dev)
- [ ] Dữ liệu seed cho dev (lấy kịch bản trong DATABASE.md)

## 5. Đã chốt

- **ORM**: Chọn **TypeORM** kết hợp `@nestjs/typeorm` và driver `pg`. Phù hợp tuyệt đối với phong cách decorator/class của NestJS. _(2026-10-05)_
- **Môi trường Database dev**: Chạy PostgreSQL 16 qua file `docker-compose.yml` local. _(2026-10-05)_
- **Khóa chính**: Dùng UUID (v4) sinh tự động cho các bảng. _(2026-10-05)_

## 6. Việc cần làm

- [ ] Tạo file `docker-compose.yml` chạy Postgres 16 local (port 5432)
- [ ] Cài đặt `@nestjs/typeorm`, `typeorm`, `pg`, `@types/pg`, `@nestjs/config` vào `api/`
- [ ] Tạo module `database` cấu hình TypeORM kết nối PostgreSQL
- [ ] Định nghĩa các Entity đầu tiên: `Agent` và `AgentRule` (theo thiết kế `DATABASE.md`)
- [ ] Tạo Seed script nạp dữ liệu mẫu ban đầu (`general`, `mail-action`, rules)

