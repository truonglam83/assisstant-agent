# Personal AI Agent

Trợ lý AI cá nhân (dành cho một người dùng), giao diện chat phong cách Claude gồm:
- **Chat chung (`general`)**: Hỏi đáp kiến thức, phân tích, tra cứu web, gợi ý mở đúng agent chuyên trách.
- **Các Agent chuyên trách**: Từng nhân viên AI chuyên một mảng với bộ tool, rule, skill, lịch chạy và luồng chat riêng (agent đầu tiên: `mail-action` — soạn/gửi báo cáo định kỳ có duyệt).

---

## 🛠 Tech Stack

| Thành phần | Công nghệ |
|---|---|
| **Frontend** | Next.js (App Router, TypeScript), Tailwind CSS v4, Auth.js v5 (Google OAuth) |
| **Backend API** | Hono (TypeScript, Node.js), REST + SSE stream, Docker |
| **Agent Core** | Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`) |
| **Database & Scheduler** | PostgreSQL, Drizzle ORM, pg-boss (chạy job nền trên Postgres) |
| **Tích hợp** | Gmail API (OAuth), Web Push (VAPID) |

---

## 📁 Cấu trúc thư mục

```text
├── docs/                 # Tài liệu chi tiết kiến trúc & quyết định (00 -> 05)
├── web/                  # Mã nguồn ứng dụng Frontend (Next.js)
├── AGENTS.md             # Quy ước & nguyên tắc làm việc dự án
├── IDEAS.md              # Ý tưởng thiết kế ban đầu
└── README.md
```

---

## 🚀 Khởi chạy Frontend (Local)

```bash
cd web
npm install
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## 📖 Tài liệu dự án

- **Tổng quan & Tiến độ**: [docs/00-overview.md](docs/00-overview.md)
- **Frontend chi tiết**: [docs/01-frontend.md](docs/01-frontend.md)
- **Backend API**: [docs/02-backend-api.md](docs/02-backend-api.md)
- **Database Schema**: [docs/03-database.md](docs/03-database.md) & [docs/DATABASE.md](docs/DATABASE.md)
- **Agent Architecture**: [docs/04-agent.md](docs/04-agent.md)
- **Hạ tầng & Deploy**: [docs/05-infra.md](docs/05-infra.md)
