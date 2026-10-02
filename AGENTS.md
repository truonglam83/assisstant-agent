# Personal AI Agent

Trợ lý AI cá nhân (một người dùng), giao diện chat giống Claude: một **chat chung** để hỏi đáp và nhiều **agent chuyên trách** (agent đầu tiên: `mail-action`). Web + PWA, backend chạy Claude Agent SDK.

## Tài liệu

| File | Vai trò |
|---|---|
| [IDEAS.md](IDEAS.md) | Ý tưởng ban đầu. Đọc để hiểu bối cảnh, **chưa phải quyết định** |
| [docs/DATABASE.md](docs/DATABASE.md) | Ý tưởng về database + dữ liệu mẫu |
| [docs/ui-mockup.html](docs/ui-mockup.html) | Giao diện sơ bộ |
| [docs/00-overview.md](docs/00-overview.md) | Mục lục detail docs, thứ tự làm, trạng thái, nhật ký quyết định |
| `docs/01-…` đến `docs/05-…` | Detail doc từng mảng: **nơi ghi các quyết định đã chốt** |

Nếu detail doc khác với IDEAS.md thì **theo detail doc**.

## Cách làm việc

- Ý tưởng không phải quyết định. Chi tiết kỹ thuật được **chốt cùng chủ dự án** khi bắt đầu làm từng mảng.
- Gặp chỗ cần quyết định: liệt kê các lựa chọn + đề xuất, **hỏi trước rồi mới viết** doc hoặc code. Không tự chốt.
- Chốt xong thì ghi vào mục **"Đã chốt"** của detail doc tương ứng và vào nhật ký quyết định trong `00-overview.md`, rồi mới code.

## Thứ tự làm

1. **Infra tối thiểu** — tạo repo ([05-infra](docs/05-infra.md))
2. **Frontend** — toàn bộ UI, chạy với mock API theo contract ([01-frontend](docs/01-frontend.md))
3. **Backend API** — hiện thực contract ([02-backend-api](docs/02-backend-api.md))
4. **Database** ([03-database](docs/03-database.md))
5. **Agent** — runner, tool, rule, trí nhớ, lịch ([04-agent](docs/04-agent.md))

Trạng thái chi tiết: xem [docs/00-overview.md](docs/00-overview.md).
