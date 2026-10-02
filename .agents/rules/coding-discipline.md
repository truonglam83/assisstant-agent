# Kỷ luật Coding (Pre-code & Post-code Routine)

Mọi tác vụ liên quan đến viết hoặc sửa đổi mã nguồn trong dự án này bắt buộc phải tuân thủ quy trình 2 bước:

## 1. Trước khi viết code (Pre-code Check)
Luôn đối chiếu với bộ skill [skills/frontend-developer/SKILL.md](skills/frontend-developer/SKILL.md):
- **Hàm & Logic**: Dùng Guard clauses & early return, đặt tên Động từ + Danh từ, gom > 2 tham số thành Object Interface, hàm thuần khiết (không mutate).
- **React Components**: Named function declaration, không dùng `useState` + `useEffect` cho dữ liệu có thể tính toán được (Derived State), thẻ HTML Semantic.
- **Ranh giới Next.js**: Giữ Page/Layout là Server Component, chỉ đẩy `"use client"` xuống lá cây, không truyền hàm qua ranh giới RSC.
- **TypeScript**: Cấm tuyệt đối `any`, dùng `unknown` + Type Guard, dùng `as const` thay Enum.
- **Quản lý State & Async**: Functional updates (`prev =>`), Discriminated Unions cho Async States, Optimistic updates có rollback khi lỗi.

## 2. Sau khi viết code (Post-code Self-Review)
- **Tự review**: Soát lại toàn bộ các file vừa sửa để đảm bảo không vi phạm các bẫy lỗi kinh điển (quên cleanup timer/listener, vòng lặp re-render, unhandled error, kẹt cờ pending).
- **Kiểm tra biên dịch**: Chạy `npx tsc --noEmit` để đảm bảo 0 lỗi TypeScript trước khi báo cáo kết quả cho người dùng.
