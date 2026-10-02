# 05 — Infra

> Trạng thái: **Khung**
>
> File này gồm 2 phần làm ở 2 thời điểm khác nhau:
> - **§3.1 (repo)**: làm đầu tiên, trước FE.
> - **§3.2–3.5 (Docker, deploy, CI)**: làm **cuối cùng**, sau khi Agent chạy được trên máy local.
>
> Ngoại lệ: **Docker Postgres chạy local** không thuộc phần "làm cuối" — nó setup ngay khi bắt đầu code Backend (xem [03-database.md](03-database.md)), vì đó là môi trường dev cần có để test, không phải infra deploy.

## 1. Mục tiêu

Repo, chạy mọi thứ bằng Docker khi dev và khi deploy, quản lý biến môi trường, deploy FE lên Vercel và BE lên Railway / Fly.io / VPS.

## 2. Tham chiếu ý tưởng

- [IDEAS.md](../IDEAS.md) §2.9 (Docker), §3 (công nghệ), §10 (biến môi trường), §11 (deploy), §12 (bẫy đã biết)
- IDEAS.md §3 có nêu ý tưởng monorepo/pnpm workspaces — **đã bỏ**, xem mục 5 Đã chốt bên dưới.

## 3. Các phần

### 3.1. Repo
- Tạo **2 repo git riêng**: `web` (frontend), `api` (backend). Không dùng monorepo.
- TypeScript, lint, format ở mỗi repo

### 3.2. Docker
- docker compose khi dev: web, api, postgres
- Dockerfile cho api (có volume bền cho session SDK)

### 3.3. Biến môi trường
- Danh sách biến cho web và api, file mẫu, cách nạp

### 3.4. Deploy
- FE lên Vercel
- BE lên Railway (hoặc Fly.io / VPS), region Singapore, 1–2GB RAM, một instance, volume bền
- Domain, CORS, Google OAuth ở chế độ production

### 3.5. CI
- Kiểm tra type, lint, test khi push

## 4. Cần chốt

- [ ] Nơi host repo (2 repo: web, api)
- [ ] Cấu trúc thư mục bên trong mỗi repo
- [ ] Phiên bản Node, pnpm
- [ ] Nếu FE và BE cần dùng chung type (ví dụ hình dạng response API) mà không có monorepo: copy tay, hay để sau tính tiếp nếu thấy phiền
- [ ] Lint và format
- [ ] Web chạy trong Docker khi dev hay chạy thẳng bằng pnpm
- [ ] Quản lý secret khi dev và khi deploy
- [ ] Có CI không, dùng gì
- [ ] Nền tảng deploy BE (Railway / Fly.io / VPS)
- [ ] Domain

## 5. Đã chốt

- **2 repo riêng (`web`, `api`), không dùng monorepo/pnpm workspaces.** Lợi ích chính của monorepo ở đây chỉ là chia sẻ type giữa FE/BE — không đủ quan trọng để đánh đổi thêm khái niệm workspace khi đang học từ đầu. Deploy vốn đã tách riêng (Vercel cho web, Railway/Fly/VPS cho api) nên việc này không ảnh hưởng gì tới deploy. *(2026-09-27)*

## 6. Việc cần làm

_(viết sau khi chốt)_
