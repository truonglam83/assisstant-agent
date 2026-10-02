# Personal AI Agent — Ý tưởng

> File này là **ý tưởng ban đầu** của dự án, dùng để hiểu bối cảnh. Đây **chưa phải quyết định**: chi tiết cụ thể sẽ cùng chốt khi làm từng mảng và ghi trong các detail doc ở [`docs/`](docs/00-overview.md). Nếu detail doc khác với file này thì theo detail doc.

---

## 1. Ý tưởng

Một **trợ lý AI cá nhân** (chỉ một người dùng) với giao diện chat giống Claude, gồm hai loại chat:

### 1.1. Chat chung (mặc định)
- Luôn nằm **trên cùng sidebar**, mở app là vào đây.
- Là nơi **hỏi đáp như Claude**: giải thích, viết, dịch, phân tích, tra cứu web.
- **Không thực hiện hành động** (không gửi mail, không đặt lịch…).
- **Biết danh sách các agent** và mỗi agent làm được gì. Nhờ vậy nó:
  - trả lời được câu hỏi về các agent, ví dụ "mail weekly nên gửi lúc mấy giờ, agent mail có lịch gì đang chạy?";
  - khi người dùng muốn **làm** một việc, nó **gợi ý đúng agent**, kèm nút mở agent đó. Ví dụ: *"Việc này agent **mail-action** làm được, bấm vào đây để mở."*
  - nếu chưa có agent nào làm được, nói rõ là chưa hỗ trợ.

### 1.2. Các agent chuyên trách
- Mỗi agent là **một "nhân viên" chuyên một mảng**, hiện trong mục **Agents** ở sidebar. Nút **"+ New agent"** để tạo agent mới ngay trên giao diện (xem 1.6).
- Mỗi agent có: tên, mô tả, hướng dẫn riêng, **bộ tool riêng**, **skill riêng**, **bộ rule riêng** (ít nhất 1 rule), danh sách việc làm được và không làm được, các lịch chạy riêng.
- **Rule** là **cách làm** mà agent phải theo khi thực hiện một việc: format, cấu trúc nội dung, văn phong, chữ ký… Rule có thể áp cho mọi việc của agent, hoặc chỉ cho một việc cụ thể (ví dụ chỉ khi gửi daily report). Còn **làm gì, cho ai** (người nhận, nội dung) thì người dùng nói trong tin nhắn. Rule **lưu trong database và sửa được** trên giao diện (tab **Rule** của agent) hoặc bằng cách nhắn cho agent. Nếu agent thấy nên thêm rule thì **gợi ý ngay trong câu trả lời**, người dùng tự quyết định có thêm hay không (xem mục 5.6).
- **Skill** là **quy trình** làm một việc: các bước, gọi tool nào, lấy dữ liệu ở đâu. Ví dụ skill `daily-report`: lấy `report_entries` của hôm nay, soạn mail theo rule, trả bản xem trước hoặc gửi. Skill là file `SKILL.md` nằm trong code backend (giống tool), Agent SDK nạp khi chạy. Skill **không chứa format, chữ ký, văn phong**, những thứ đó là rule. Mỗi agent chỉ dùng được các skill được cấp (cột `agents.skills`). Viết skill mới cần code, sau đó nó xuất hiện trong popup tạo/sửa agent để tick.
- Mỗi agent có **một luồng chat liên tục**, giống nhắn tin với một người trợ lý: bấm vào agent là thấy toàn bộ trao đổi từ trước đến nay. **Kết quả của các việc chạy theo lịch cũng hiện ngay trong luồng này**, dưới dạng tin nhắn từ agent (xem ví dụ 1.5).
- Người dùng bấm vào agent, chat và ra lệnh. Agent **làm những gì trong phạm vi của nó**. Việc nằm ngoài phạm vi thì **nói rõ là không thực hiện được**, gợi ý agent khác nếu có. Không bao giờ giả vờ đã làm.
- Việc có hậu quả (gửi mail, xoá, push code…) phải **chờ người dùng bấm duyệt**.

### 1.3. Hướng phát triển
- **Bắt đầu nhỏ**: một agent đầu tiên là `mail-action`, làm các việc nhỏ, rõ ràng.
- **Mở rộng dần**: thêm agent mới (GitHub, Calendar, Drive…) mà không phải sửa phần lõi. Thêm agent chủ yếu là **thêm cấu hình, tool và skill**.
- **Về sau (tuỳ chọn)**: chat chung có thể gọi các agent như **sub-agent** để tự làm hộ, thay vì chỉ gợi ý.
- **Càng dùng càng hiểu người dùng**: trợ lý tự ghi nhớ bạn là ai, thích gì, hay làm việc với ai, và dùng chung hiểu biết đó cho mọi agent (xem mục 5).
- Dùng được trên **web và điện thoại** (PWA, có push notification).

### 1.4. Agent đầu tiên: `mail-action`
| Việc | Cách làm |
|---|---|
| Viết mail **weekly report** theo format cố định | Skill `weekly-report` (quy trình) + rule `weekly-report` (format) |
| Viết mail **daily report** | Skill `daily-report` (quy trình) + rule `daily-report` (format) |
| Gửi mail **theo giờ cố định** (hằng ngày, hằng tuần) | Tool đặt lịch + scheduler |
| Nhận nội dung report qua chat trước giờ gửi ("hôm nay đã làm…, todo…") | Lưu vào `agent_records`, collection `report_entries` |
| Soạn và gửi mail bất kỳ (to, cc, bcc) | Tool `draft_email`, `send_email` (có duyệt) |
| Quản lý người nhận | Tool danh bạ |
| **Không làm**: đọc hộp thư, xoá mail, việc ngoài email | Trả lời là không thực hiện được |

### 1.5. Ví dụ trải nghiệm: daily và weekly report

**Tối thứ Hai**, trong luồng chat của `mail-action`:
> **Bạn:** Lịch 7h gửi mail daily report hằng sáng. Sáng thứ 6 thì gửi thêm weekly report cũng lúc 7h.
> **Agent:** Đã tạo 2 lịch: Daily report 7h thứ 2–6, Weekly report 7h thứ 6. Người nhận: anh Minh (to), chị Lan (cc). Trước 7h bạn nhắn nội dung cho mình nhé.

**Sáng thứ Năm 6h30:**
> **Bạn:** Hôm qua đã làm API đăng nhập, todo: trang chat.
> **Agent:** Đã ghi nhận cho daily report hôm nay. Bản xem trước: *(tiêu đề, to, cc, nội dung)*. 7h mình sẽ gửi. Muốn sửa thì nhắn trước 7h.

**7h00**, agent tự đăng một tin nhắn vào luồng chat (kèm thông báo đẩy):
> **Agent:** ✅ Đã gửi daily report.
> Tiêu đề: [Daily Report] 01/10/2026 · To: minh@company.com · Cc: lan@company.com · Bcc: —
> Nội dung: Hôm qua đã làm: API đăng nhập. Todo: trang chat.

**Sáng thứ Sáu 6h30:**
> **Bạn:** Hôm qua làm trang chat, todo: kết nối Gmail. Weekly: tuần này xong đăng nhập và chat, tuần sau làm agent mail.
> **Agent:** Đã ghi nhận cho cả daily và weekly report hôm nay. *(2 bản xem trước)*

**7h00**, luồng chat có **2 tin nhắn riêng**:
> **Agent:** ✅ Đã gửi daily report. *(tiêu đề, to, cc, bcc, nội dung)*
> **Agent:** ✅ Đã gửi weekly report. *(tiêu đề, to, cc, bcc, nội dung)*

**Nếu đến 7h chưa có nội dung:** không gửi mail trống. Agent đăng tin "⚠️ Chưa gửi daily report vì chưa có nội dung. Nhắn nội dung để mình gửi ngay." và gửi thông báo đẩy. Có thể bật thêm **nhắc trước lúc 6h45**.

### 1.6. Tạo agent mới

Ở mục **Agents** trên sidebar có nút **"+ New agent"**. Bấm vào mở **popup** gồm:

| Trường | Ý nghĩa |
|---|---|
| Tên | Tên hiển thị, ví dụ "Chi tiêu" |
| Mô tả ngắn | Agent này làm gì. **Chat chung dựa vào đây để gợi ý đúng agent**, nên viết rõ |
| Hướng dẫn | Vai trò và cách làm việc chung, viết bằng lời. Ví dụ "Bạn là trợ lý quản lý chi tiêu cá nhân, ghi lại từng khoản chi, báo cáo cuối tháng" |
| Việc làm được / không làm được | Mỗi dòng một việc. Agent dựa vào đây để biết khi nào nói "không làm được" |
| Công cụ | Tick chọn các nhóm tool **đã có sẵn trong hệ thống**: Gửi mail, Danh bạ, Lịch chạy, Lưu dữ liệu (`agent_records`), Tìm kiếm web… |
| Skill | Tick chọn các skill **đã có sẵn trong hệ thống**, ví dụ `daily-report`, `weekly-report`. Không bắt buộc |
| Model | Mặc định Haiku (rẻ). Chọn Sonnet nếu việc cần suy nghĩ nhiều |
| Icon / màu | Tuỳ chọn, để phân biệt trên sidebar |

Bấm **Tạo**:
1. Backend tạo agent (một dòng `agents`) và luồng chat của nó.
2. Mở thẳng trang agent ở **tab Rule** để thêm rule đầu tiên. Agent cần **ít nhất 1 rule** thì ô chat mới hoạt động. Chưa có rule thì hiện nhắc "Thêm ít nhất 1 rule để bắt đầu".
3. Sau đó dùng như mọi agent: chat ở tab Chat, sửa rule ở tab Rule.

Sửa thông tin agent sau này: nút ⚙️ trên trang agent, mở lại đúng popup đó. Xoá agent: có xác nhận. Agent `general` (chat chung) không xoá được.

**Giới hạn cần biết:** tạo agent mới trên giao diện chỉ **ghép lại những công cụ và skill đã có**. Nếu agent mới cần làm việc hệ thống chưa hỗ trợ (ví dụ đọc Google Calendar), phải code thêm tool hoặc kết nối MCP trước, sau đó nó mới xuất hiện trong danh sách "Công cụ" để tick. Skill mới cũng vậy.

## 2. Nguyên tắc thiết kế

1. **Agent chạy trên server, web và app chỉ là giao diện.** Một backend phục vụ mọi client.
2. **Mỗi agent chỉ có đúng những tool nó cần.** Khả năng của agent bằng tool được cấp. Chat chung không có tool hành động.
3. **Agent được định nghĩa bằng cấu hình**, không hard-code. Thêm agent mới = bấm **"+ New agent"**, điền thông tin, chọn công cụ có sẵn, thêm rule. Chỉ khi cần công cụ mới thì mới phải code. **Không tạo bảng database mới cho mỗi agent** (xem mục 6.1).
4. **Trung thực về phạm vi:** làm được thì làm, không làm được thì nói rõ.
5. **Tin nhắn nói làm gì, rule nói làm thế nào.** Người dùng chỉ cần đưa thông tin thay đổi mỗi lần (người nhận, nội dung). Những thứ cố định (format, chữ ký, văn phong) nằm trong rule, agent tự áp dụng.
6. **Lưu hết, gửi ít, hiểu dần:** lưu toàn bộ lịch sử cho người dùng, nhưng chỉ gửi cho model những gì đã chắt lọc: trí nhớ về người dùng, tóm tắt và cuộc chat hiện tại (xem mục 5).
7. **An toàn mặc định:**
   - Việc chỉ đọc hoặc soạn nháp: cho tự chạy.
   - Việc gửi đi, xoá, thay đổi bên ngoài: bắt buộc duyệt.
   - Ngoại lệ: **lịch do chính người dùng tạo** và người dùng **đã thấy bản xem trước nội dung** (như ví dụ 1.5) thì được tự gửi đúng giờ. Người dùng có thể đổi lịch sang chế độ "chờ duyệt" bất cứ lúc nào.
8. **Đơn giản, một người dùng:** không multi-tenant, không phân quyền phức tạp.
9. **Mọi thứ chạy bằng Docker**, cả khi dev lẫn khi deploy.

## 3. Công nghệ

| Phần | Chọn | Ghi chú |
|---|---|---|
| Frontend | **Next.js** (App Router, TypeScript) | Giao diện chat, PWA, deploy lên Vercel |
| Đăng nhập | **Auth.js** với Google provider | **Chỉ cho phép một email** (`ALLOWED_EMAIL`) |
| Backend | **Hono** (Node.js, TypeScript) | Nhẹ, có `streamSSE` để stream |
| Agent | **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) | Có sẵn vòng lặp agent, session, compaction, prompt caching, MCP, permissions, skills, sub-agent |
| LLM | Claude qua **API key** | Không dùng đăng nhập claude.ai trong sản phẩm |
| Database | **PostgreSQL** + **Drizzle ORM** | Supabase/Neon hoặc Postgres của Railway |
| Scheduler | **pg-boss** | Chạy job trên Postgres, không cần Redis |
| Email | **Gmail API** (OAuth, scope `gmail.send`) | Backend giữ refresh token |
| Push | **Web Push** (VAPID, thư viện `web-push`) | Báo "có việc cần duyệt" |
| Hạ tầng | **Docker** + docker compose | BE deploy lên Railway / Fly.io / VPS (region Singapore) |
| Monorepo | **pnpm workspaces** | Chia sẻ type giữa FE và BE |

**Vì sao backend tách khỏi Next.js/Vercel:** agent chạy lâu (có thể vài phút), cần ổ đĩa bền để lưu session của SDK, và cần scheduler chạy nền. Serverless không đáp ứng được mấy thứ này.

**Agent SDK nằm ở đâu:** nó là một **thư viện npm**, cài vào backend giống mọi dependency khác. Gói này chứa sẵn "động cơ" Claude Code và tự khởi chạy nó khi gọi `query()`. Không có server hay dịch vụ riêng nào phải deploy: build Docker image của backend là SDK đi kèm luôn. Phần "não" (model) vẫn chạy trên server của Anthropic, SDK gọi tới qua `ANTHROPIC_API_KEY`.

## 4. Kiến trúc

```
[Web / PWA điện thoại]  Next.js + Auth.js (Google)          — Vercel
   Sidebar: ① Chat chung  ② Agents (mail-action, … + New agent)  ③ Lịch & duyệt
   Trang agent: tab Chat | tab Rule | ⚙️ sửa thông tin agent
        │  REST + SSE (trình duyệt gọi THẲNG backend, không proxy qua Vercel)
        ▼
[Backend API]  Hono + Claude Agent SDK                      — Docker (Railway/Fly/VPS)
   ├─ Agent registry: danh sách agent và cấu hình của từng agent
   ├─ Agent runner: chạy agent với đúng prompt, tool, skill của nó (chỉ nạp skill có trong `agents.skills`)
   ├─ Quản lý ngữ cảnh: quyết định gửi gì cho model (mục 5)
   ├─ Duyệt hành động, Scheduler, Web Push
   └─ Volume bền: session của SDK + thư mục làm việc của các agent
        ▼
[PostgreSQL]  toàn bộ lịch sử chat, cấu hình, lịch, danh bạ…
```

## 5. Ngữ cảnh, trí nhớ và tiết kiệm token

Mục tiêu có hai vế, nghe thì ngược nhau:
- **Càng nói chuyện nhiều, trợ lý càng hiểu mình**, giống một người trợ lý thật: nhớ mình là ai, làm gì, thích gì, hay làm việc với ai.
- **Nhưng không được gửi hết lịch sử cho model**, vì rất tốn tiền và token.

Cách giải: **không gửi lịch sử, mà gửi "những gì đã học được từ lịch sử"**.

### 5.1. Ý tưởng cốt lõi: tách "kho lưu trữ" và "trí nhớ"

| | Kho lưu trữ (Database) | Trí nhớ (gửi cho model) |
|---|---|---|
| Phục vụ ai | Người dùng | Agent |
| Chứa gì | **Toàn bộ**: mọi tin nhắn, tool đã gọi, kết quả, mail đã gửi, việc đã duyệt | **Phần đã chắt lọc**: hiểu biết về người dùng, tóm tắt, cuộc chat hiện tại |
| Kích thước | Tăng mãi | Giữ nhỏ, có giới hạn |
| Dùng để | Xem lại, tìm kiếm, kiểm tra agent đã làm gì | Để model hiểu người dùng và trả lời |

Giống con người: mình không nhớ từng câu đã nói với ai đó năm ngoái, nhưng nhớ **họ là ai, thích gì, đã cùng làm những gì**. Khi cần chi tiết thì mới lục lại tin nhắn cũ.

### 5.2. Bốn tầng trí nhớ

| Tầng | Giống con người | Chứa gì | Cách làm |
|---|---|---|---|
| **1. Ngắn hạn** | Nhớ câu vừa nói | Phần gần nhất của luồng chat (trong ngày) | Agent SDK giữ qua `resume`, tự nén khi quá dài. **Mỗi ngày bắt đầu session mới** (xem 5.5) |
| **2. Gần đây** | Nhớ mấy hôm nay đã làm gì | Tóm tắt 3–5 ngày gần nhất trong luồng chat của agent | Cuối mỗi ngày (hoặc khi chuyển session) viết một bản tóm tắt ngắn |
| **3. Dài hạn** | Hiểu con người đối diện | **Hồ sơ người dùng** (dùng chung mọi agent) + **ghi nhớ riêng của agent** | Tự rút ra sau mỗi cuộc chat, lưu trong bảng `memories` |
| **4. Tra cứu** | Lục lại tin nhắn cũ khi cần | Toàn bộ kho lưu trữ | Agent gọi `search_history` khi người dùng nhắc chuyện cũ |

**Hồ sơ người dùng (ghi nhớ dùng chung)** là thứ làm trợ lý "càng dùng càng hiểu". Mọi agent đều đọc được. Ví dụ:
- "Tên Tuấn, làm backend developer ở công ty X, làm việc từ 9h đến 18h."
- "Thích câu trả lời ngắn gọn, tiếng Việt, xưng mình/bạn."
- "Sếp là anh Minh (minh@company.com). Team gồm Lan, Hùng."
- "Đang làm dự án Personal AI Agent bằng Next.js và Hono."

**Ghi nhớ riêng của agent** chỉ agent đó dùng. Ví dụ với `mail-action`:
- "Thường nhắn nội dung report khoảng 6h30."
- "Không thích câu chào mở đầu dài dòng."

**Cách làm** một việc (format, cấu trúc, chữ ký, văn phong…) không nằm trong trí nhớ mà là **rule** (mục 5.6). Trí nhớ là hiểu biết và sở thích, được chọn lọc khi gửi cho model. Rule luôn được gửi đầy đủ.

Nhờ vậy, chat chung biết bạn là ai dù bạn chưa từng nói trong cuộc chat đó. Agent mới thêm vào cũng hiểu bạn ngay từ ngày đầu.

### 5.3. Trợ lý học như thế nào

**a. Tự học sau mỗi cuộc chat**
1. Không có tin nhắn mới trong 30 phút, hoặc hết ngày.
2. Một job chạy nền dùng model rẻ (Haiku) đọc **phần tin nhắn mới** kể từ lần học trước cùng các ghi nhớ hiện có, rồi quyết định:
   - **Thêm** điều mới đáng nhớ;
   - **Sửa** điều đã cũ (ví dụ "đã chuyển sang team B" thì thay cho "đang ở team A");
   - **Xoá** điều không còn đúng;
   - **Bỏ qua** chuyện vặt, chỉ dùng một lần.
3. Đồng thời viết **bản tóm tắt** cho phần đó.

**b. Người dùng dặn trực tiếp**
- "Nhớ giúp mình là từ tháng sau daily report gửi thêm chị Hoa" → agent gọi tool `remember`, lưu ngay.
- "Quên chuyện đó đi" → tool `forget`.
- Giao diện hiện một dòng nhỏ "Đã ghi nhớ: …" để người dùng biết.

**c. Học từ việc người dùng sửa**
- Khi người dùng sửa bản nháp trước khi bấm duyệt (ví dụ luôn xoá câu chào dài dòng), phần khác biệt được lưu lại. Job tự học ở bước (a) sẽ rút ra sở thích, ví dụ "Không thích câu chào dài".

**d. Người dùng kiểm soát được**
- Có trang **"Trí nhớ"**: xem, sửa, xoá, ghim từng ghi nhớ.
- **Không lưu** mật khẩu, token, số tài khoản hay thông tin nhạy cảm vào trí nhớ.

### 5.4. Mỗi lần gọi model: ghép ngữ cảnh thế nào

**Thứ tự ghép** (phần ít thay đổi đặt trước để được cache):

```
SYSTEM PROMPT
 1. <instructions>   Hướng dẫn chung + hướng dẫn của agent       ← gần như không đổi
 2. <rules>          Rule của agent (bắt buộc)                  ← ít đổi
 3. <user_profile>   Hồ sơ người dùng (memories dùng chung)     ← đổi theo ngày
 4. <agent_memory>   Ghi nhớ riêng của agent
 5. <recent>         Tóm tắt 3–5 ngày gần nhất
 6. <today>          Ngày giờ hiện tại, múi giờ
TOOLS                Chỉ tool của agent này
MESSAGES             Luồng chat hôm nay (SDK giữ) + tin nhắn mới
```

**Rule và trí nhớ được trình bày khác nhau**, để model hiểu mức độ quan trọng:
- `<rules>`: ghi rõ "**Cách làm bắt buộc cho từng việc** (format, cấu trúc, văn phong, chữ ký). Luôn áp dụng khi làm việc tương ứng. Nếu người dùng dặn khác cho riêng lần này thì theo lời người dùng. Nếu thấy nên thêm hoặc sửa rule thì gợi ý trong câu trả lời, không tự thay đổi rule."
- `<user_profile>`, `<agent_memory>`: ghi rõ "**Thông tin tham khảo** về người dùng, có thể đã cũ. Nếu người dùng nói khác trong cuộc chat thì theo lời người dùng."

**Chọn rule nào**

| Tình huống | Rule được nạp |
|---|---|
| Chat trong luồng của agent | Rule `all` đầy đủ + **toàn bộ rule theo việc** của agent đó (mỗi agent thường ít rule nên nạp hết). Nếu quá nhiều: rule `all` đầy đủ, rule theo việc chỉ gửi tiêu đề; khi agent bắt đầu làm việc đó, backend nạp đầy đủ rule của việc đó |
| Job chạy theo lịch | Rule `all` + rule của **đúng `task_type`** của lịch |
| Chat chung | Không nạp rule của các agent. Chỉ biết mô tả và khả năng của agent |

Rule **không bao giờ bị lược bớt** vì giới hạn token. Giao diện cảnh báo khi rule của một agent dài quá khoảng 1.500 token để người dùng gọn lại.

**Chọn trí nhớ nào** (giới hạn khoảng 1.500–2.000 token cho mục 3–5):
1. Ghi nhớ được **ghim**;
2. Ghi nhớ **liên quan** đến việc đang làm hoặc tin nhắn hiện tại (từ khoá, về sau pgvector);
3. Ghi nhớ **hay dùng / mới cập nhật**.

Phần không được chọn vẫn tra cứu được bằng `search_history`.

**Giữ cache ổn định trong ngày**
- Rule, hồ sơ, ghi nhớ và tóm tắt được **chụp lại một lần khi bắt đầu session trong ngày**. Job tự học chạy nền không làm system prompt thay đổi giữa chừng, nên cache không bị phá.
- Ngoại lệ, có hiệu lực ngay:
  - Người dùng **sửa rule**: system prompt được dựng lại ở lượt tiếp theo.
  - Người dùng **dặn ghi nhớ** (`remember`): điều đó đã nằm trong cuộc chat hôm nay nên model biết luôn. Từ ngày mai nó vào `<agent_memory>`.

**Khi có mâu thuẫn, ưu tiên theo thứ tự:**
1. **Lời người dùng trong tin nhắn hiện tại** (chỉ áp dụng cho lần này). Ví dụ "lần này không cần chữ ký".
2. **Rule**: rule theo việc (ví dụ `daily-report`) thắng rule `all`.
3. **Trí nhớ** (ghi nhớ agent, rồi hồ sơ người dùng).

Nếu người dùng muốn đổi luôn từ nay về sau thì agent đề xuất sửa rule (`propose_rule_change`).

### 5.5. Các cách tiết kiệm token khác

**Agent SDK tự lo (có sẵn):**
- **Prompt caching**: phần lặp lại mỗi lượt (hướng dẫn, danh sách tool, lịch sử cũ) được cache, tính tiền rẻ hơn nhiều.
- **Tự nén (compaction)**: cuộc chat quá dài thì SDK tự tóm tắt phần cũ.

**Thiết kế của mình:**
- **Luồng chat liên tục trên giao diện, nhưng session của model xoay vòng mỗi ngày.** Người dùng thấy một luồng chat không đứt đoạn. Bên dưới, mỗi ngày (hoặc khi luồng quá dài) backend mở **session SDK mới**, mang theo tóm tắt + trí nhớ. Nhờ vậy dùng cả năm thì chi phí mỗi tin nhắn vẫn không tăng.
- **Việc chạy theo lịch chạy nền, tách khỏi luồng chat.** Job lúc 7h **không đọc lại luồng chat**. Nó lấy dữ liệu đã được lưu có cấu trúc (ví dụ `report_entries` của hôm nay), chạy trong một session riêng ngắn gọn, rồi chỉ **đăng một tin nhắn kết quả** vào luồng chat.
- **Kết quả tool ngắn gọn**: chỉ trả về điều cần biết, ví dụ "Đã gửi, mã mail X".
- **Mỗi agent chỉ có tool của nó**: mô tả tool cũng tốn token.
- **Chọn model theo việc**: việc tự học, tóm tắt, việc đơn giản dùng Haiku.

**Theo dõi chi phí:**
- Mỗi lượt chat lưu **số token và chi phí**. Job tự học và tóm tắt cũng được tính.
- Dashboard hiển thị chi phí theo ngày, theo agent. Có **ngưỡng cảnh báo** và giới hạn số bước mỗi lượt (`maxTurns`).

### 5.6. Rule của agent

**Rule là gì:** hướng dẫn **cách làm** một việc, viết bằng lời, giống bản hướng dẫn giao cho nhân viên mới. Ví dụ với `mail-action`:
- Daily report: tiêu đề "[Daily Report] dd/mm/yyyy"; nội dung gồm 3 mục Đã làm, Todo, Vướng mắc; mở đầu "Dear anh/chị,".
- Chữ ký: "Best regards, Tuấn – Backend Developer – 0901 234 567".
- Văn phong: ngắn gọn, lịch sự, không mở đầu dài dòng.

**Tin nhắn và rule phối hợp thế nào**

> **Bạn:** Gửi mail daily report tới chị phuongtn@gmail.com, cc hoahh@gmail.com. Nội dung: hôm nay tôi làm xong API đăng nhập, mai làm trang chat.

Agent xử lý:
1. Nhận ra đây là việc **`daily-report`**.
2. Lấy từ **tin nhắn**: người nhận (to: phuongtn@gmail.com, cc: hoahh@gmail.com) và nội dung.
3. Lấy từ **rule**: rule chung + rule của `daily-report`, tức tiêu đề, cấu trúc 3 mục, lời mở đầu, văn phong, chữ ký.
4. Soạn mail: đặt nội dung vào đúng format, sắp xếp thành Đã làm / Todo, thêm chữ ký.
5. Hiện **bản xem trước** (tiêu đề, to, cc, nội dung). Bạn duyệt thì gửi.

Bạn chỉ nói **những gì thay đổi mỗi lần**. Những gì lần nào cũng giống nhau thì nằm trong rule.

**Phạm vi của rule**
- `Chung`: áp cho mọi việc của agent. Ví dụ chữ ký, văn phong.
- Theo từng việc: `daily-report`, `weekly-report`, `send_email`… Khi làm việc nào, agent nhận **rule chung + rule của đúng việc đó**.

**Sửa rule: tab "Rule" của mỗi agent**

Trang agent có 2 tab: **Chat** và **Rule**. Tab Rule là danh sách rule dạng form, mỗi rule một dòng:

| Trường | Kiểu nhập |
|---|---|
| Phạm vi | Dropdown: `Chung` hoặc một việc cụ thể (`daily-report`, `weekly-report`…) |
| Tên | Ô nhập ngắn, ví dụ "Chữ ký", "Format daily". Dùng để hiển thị và khi rule quá nhiều thì chỉ gửi tên cho model (mục 5.4) |
| Nội dung | Ô nhập text, nhiều dòng. Viết bằng lời, ví dụ format tiêu đề, cấu trúc nội dung, chữ ký |
| Bật/tắt | Công tắc |
| Thao tác | Sửa, xoá, xem lịch sử |

- Nút **"+ Thêm rule"** thêm một dòng trống để nhập.
- Sửa trực tiếp trên dòng rồi bấm **Lưu**.
- Agent luôn có **ít nhất 1 rule đang bật**.

**Sửa rule bằng cách nhắn**
- "Từ nay chữ ký đổi số điện thoại thành 0987…": agent gọi tool `propose_rule_change`, hiện **thẻ xác nhận** (rule cũ → rule mới). Bạn bấm đồng ý thì mới áp dụng.

**Agent gợi ý rule**
- Nếu agent thấy nên thêm hoặc sửa rule (ví dụ bạn phải sửa cùng một chỗ nhiều lần), nó **chỉ cần nói trong câu trả lời**. Ví dụ: *"Gợi ý: nên thêm vào rule daily report 'mỗi việc trong Todo ghi kèm ngày dự kiến xong', vì 2 lần gần đây bạn đều sửa tay để thêm ngày."*
- Agent **không tự thêm hay sửa rule**.

**Lịch sử**
- Mỗi lần sửa được **lưu lịch sử** (ai sửa, lúc nào, nội dung cũ), để xem lại và khôi phục.
- Rule đổi thì **có hiệu lực ngay từ lần làm việc tiếp theo**, kể cả lịch 7h sáng mai.

**An toàn khi gửi** không nằm trong rule mà nằm ở **bản xem trước + bấm duyệt** (mục 2, nguyên tắc 7). Bạn luôn thấy mail sẽ gửi cho ai, nội dung gì trước khi nó đi.

### 5.7. Dự phòng
Nếu dữ liệu session của SDK bị mất (ví dụ mất volume), vẫn dựng lại được ngữ cảnh từ **tóm tắt + trí nhớ** trong database. Trợ lý chỉ quên chi tiết của cuộc chat dở dang, không quên người dùng.

## 6. Dữ liệu lưu trong Database

> Đây là **danh sách các bảng trong PostgreSQL** và mỗi bảng lưu gì. Hiểu đơn giản: mỗi bảng giống một sheet Excel, mỗi dòng là một bản ghi. Tên cột cụ thể sẽ chốt khi code.
> Sơ đồ quan hệ, các cột chính và dữ liệu mẫu: xem **[`docs/DATABASE.md`](docs/DATABASE.md)**. Giao diện sơ bộ: **[`docs/ui-mockup.html`](docs/ui-mockup.html)**.

| Bảng | Lưu gì |
|---|---|
| `agents` | Danh sách agent: tên, mô tả, **hướng dẫn (instructions)**, việc làm được / không làm được, tool và skill được cấp, model dùng. Agent `general` (chat chung) có sẵn, không xoá được |
| `conversations` | Luồng chat: mỗi agent có **một luồng chính** (chat chung cũng vậy). Lưu mã session SDK hiện tại |
| `conversation_sessions` | Các session SDK theo từng ngày của một luồng chat, kèm **bản tóm tắt** của ngày đó |
| `messages` | **Toàn bộ tin nhắn** trong luồng chat: người dùng, agent, tool đã gọi và kết quả, và **tin nhắn sự kiện** do lịch chạy đăng vào (ví dụ "✅ Đã gửi daily report"). Kèm số token và chi phí mỗi lượt |
| `memories` | **Trí nhớ dài hạn**: hồ sơ người dùng (dùng chung mọi agent) và ghi nhớ riêng của từng agent. Có thể ghim, sửa, xoá trên trang "Trí nhớ" |
| `agent_rules` | **Rule của từng agent**: phạm vi (mọi việc hoặc một việc cụ thể), nội dung (format, cấu trúc, văn phong, chữ ký…), bật/tắt. Sửa được trên tab Rule |
| `agent_rule_versions` | Lịch sử mỗi lần sửa rule, để xem lại và khôi phục |
| `contacts` | Danh bạ người nhận mail, dùng chung |
| `schedules` | Các việc chạy theo lịch: agent nào, giờ nào, làm gì, gửi luôn hay chờ duyệt |
| `schedule_runs` | Lịch sử mỗi lần chạy theo lịch: thành công hay lỗi, mail đã gửi, và **tin nhắn kết quả đã đăng vào luồng chat** |
| `approvals` | Các việc chờ duyệt: việc gì, nội dung, đã duyệt hay từ chối |
| `integrations` | Kết nối dịch vụ ngoài (Gmail, GitHub…), token được **mã hoá** |
| `push_subscriptions` | Thiết bị nhận thông báo đẩy |
| `agent_records` | **Dữ liệu nghiệp vụ riêng của từng agent**, dạng JSON, chia theo "ngăn" (`collection`). Ví dụ khoản chi tiêu, kế hoạch, ghi chú học tập |

Tìm kiếm lịch sử giai đoạn đầu dùng **full-text search của Postgres**. Về sau cần tìm theo ý nghĩa thì thêm **pgvector** (vẫn trong Postgres, không cần database mới).

### 6.1. Thêm agent mới không cần thêm bảng

Dữ liệu chia làm 3 loại:

1. **Bảng lõi, dùng chung cho mọi agent**: `agents`, `agent_rules`, `conversations`, `conversation_sessions`, `messages`, `memories`, `schedules`, `schedule_runs`, `approvals`. Mỗi dòng có `agent_id`. Thêm agent = bấm "+ New agent", backend thêm **một dòng** vào `agents`.
2. **Dữ liệu riêng của agent** → bảng chung **`agent_records`** (agent, collection, data JSON). Mỗi agent tự đặt collection của mình, ví dụ `finance/expenses`, `finance/budgets`, `planner/plans`, `study/notes`. Agent đọc ghi qua các tool chung `save_record`, `query_records`, `update_record`, `delete_record`.
3. **Dữ liệu nằm ở app ngoài** (Google Calendar, Notion, Google Sheets, Drive…) → **không lưu trong database**, agent truy cập qua MCP.

**Khi nào mới tạo bảng riêng:** chỉ khi dữ liệu của một agent **rất nhiều, cấu trúc cố định và truy vấn phức tạp thường xuyên**, ví dụ agent chi tiêu dùng nhiều năm. Lúc đó chuyển collection đó thành bảng riêng. Không làm trước.

**Dự kiến cho các agent tương lai:**
| Agent | Dữ liệu lưu ở đâu |
|---|---|
| Lập kế hoạch | `agent_records` (plans) hoặc Google Calendar/Notion qua MCP |
| Quản lý chi tiêu tháng | `agent_records` (expenses, budgets). Về sau có thể tách bảng riêng |
| Học thuật | Chủ yếu hỏi đáp. Ghi chú lưu trong `agent_records`. Tài liệu dài: thêm bảng `documents` **dùng chung** + pgvector |

## 7. Luồng chính

**Chat (dùng chung cho mọi agent)**
1. Người dùng gửi tin nhắn vào luồng chat của agent. Backend lưu ngay vào `messages`.
2. Backend chuẩn bị ngữ cảnh theo mục 5.4, chạy agent với **chỉ các tool của agent đó**.
3. Từng bước (chữ, tool đang chạy, yêu cầu duyệt, gợi ý agent) được stream về giao diện qua SSE.
4. Kết thúc lượt: lưu câu trả lời, token và chi phí vào `messages`.
5. Im lặng 30 phút hoặc hết ngày: job nền viết tóm tắt và cập nhật trí nhớ (mục 5.3). Sang ngày mới: mở session SDK mới cho luồng chat.

**Chat chung gợi ý agent**
1. Chat chung có tool chỉ đọc để xem danh sách agent, khả năng và lịch đang chạy của từng agent.
2. Khi người dùng muốn làm một việc, chat chung gọi `suggest_agent`. Giao diện hiện **thẻ gợi ý có nút "Mở agent"**.
3. Bấm vào thì mở luồng chat của agent đó, có thể điền sẵn yêu cầu vào ô nhập.
4. Không có agent phù hợp thì trả lời là hiện chưa hỗ trợ.

**Agent ngoài phạm vi**
- Mọi agent chuyên trách có quy tắc: chỉ làm việc trong phạm vi. Ngoài phạm vi thì nói rõ "Mình không thực hiện được việc này", kèm lý do ngắn và gợi ý agent khác nếu có.

**Duyệt hành động**
- Gặp việc nhạy cảm (ví dụ gửi mail), agent dừng lại, tạo yêu cầu duyệt, hiện thẻ duyệt trên giao diện và gửi thông báo đẩy.
- Người dùng bấm Duyệt thì agent làm tiếp. Bấm Từ chối thì agent dừng.

**Mail theo lịch (daily, weekly)**: xem ví dụ 1.5.
1. **Tạo lịch:** người dùng nói bằng lời trong luồng chat. Agent tạo 2 lịch riêng (`daily-report`: 7h thứ 2–6, `weekly-report`: 7h thứ 6), mỗi lịch có người nhận to/cc/bcc.
2. **Nhận nội dung:** người dùng nhắn nội dung bất cứ lúc nào trước giờ gửi. Agent tách ra phần daily và weekly, lưu vào `agent_records` (collection `report_entries`, kèm ngày và loại report), rồi trả lời bằng **bản xem trước**. Nhắn lại lần nữa thì cập nhật bản ghi của hôm đó.
3. **Đến giờ:** scheduler chạy một job nền cho mỗi lịch. Job:
   - lấy `report_entries` của hôm nay đúng loại report;
   - dùng skill tương ứng để soạn mail theo format;
   - gửi mail (chế độ tự gửi), hoặc tạo yêu cầu duyệt (chế độ chờ duyệt);
   - **đăng một tin nhắn kết quả vào luồng chat**: tiêu đề, to, cc, bcc, nội dung; gửi thông báo đẩy.
4. **Không có nội dung:** không gửi. Đăng tin nhắn cảnh báo + thông báo đẩy. Người dùng nhắn nội dung thì agent gửi ngay.
5. Ghi kết quả vào `schedule_runs`.
6. Hai lịch chạy cùng giờ (sáng thứ 6) là **2 job độc lập, 2 tin nhắn kết quả riêng**. Lỗi một bên không ảnh hưởng bên kia.

## 8. Tools

| Tool | Agent được dùng | Cần duyệt? |
|---|---|---|
| `WebSearch`, `WebFetch` (có sẵn trong SDK) | general (các agent khác tuỳ cấu hình) | Không |
| `list_agents`, `get_agent_info`, `suggest_agent` | general | Không |
| `search_history` | mọi agent | Không |
| `remember` / `forget` (ghi nhớ khi người dùng dặn) | mọi agent | Không (hiện thông báo "Đã ghi nhớ") |
| `list_rules` | mọi agent | Không |
| `propose_rule_change` (thêm, sửa, tắt rule) | mọi agent | **Có**, người dùng xác nhận trên thẻ |
| `get_contacts` / `add_contact` | mail-action | Không |
| `draft_email` (tạo nháp, trả bản xem trước) | mail-action | Không |
| `send_email` (to, cc, bcc, tiêu đề, nội dung) | mail-action | **Có** (trừ lịch đã bật tự gửi và người dùng đã xem trước) |
| `create_schedule` / `list_schedules` / `update_schedule` / `cancel_schedule` | mail-action | Có / Không / Có / Có |
| `save_record` / `query_records` / `update_record` / `delete_record` | agent nào cần lưu dữ liệu riêng (chỉ trong collection của agent đó) | Không / Không / Không / Có |

- Hỏi đáp thông thường không cần tool. Model trả lời trực tiếp như Claude.
- Tool chạy lệnh và sửa file có sẵn trong SDK (`Bash`, `Write`, `Edit`…): **tắt cho mọi agent ở giai đoạn đầu**.

## 9. Bảo mật và đăng nhập

- Đăng nhập Google, **chỉ cho phép đúng email của chủ app**.
- Backend kiểm tra token đăng nhập ở mọi request.
- Backend chỉ nhận request từ domain của frontend.
- Token Gmail/GitHub **mã hoá** khi lưu.
- Kết nối Gmail là **bước riêng**, tách khỏi đăng nhập.
- Tool được cấp **theo agent** ở phía backend. Giao diện không tự chọn tool được.

## 10. Biến môi trường

```
# api
ANTHROPIC_API_KEY=
DATABASE_URL=
API_JWT_SECRET=
ENCRYPTION_KEY=
ALLOWED_ORIGIN=https://<frontend-domain>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# web
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
ALLOWED_EMAIL=
API_JWT_SECRET=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
```

## 11. Deploy

- **Dev:** `docker compose up` chạy web, api và postgres.
- **Frontend:** Vercel.
- **Backend:** Docker lên Railway (hoặc Fly.io/VPS), chọn region Singapore nếu có.
  - Cấp **1–2GB RAM**, vì mỗi lượt agent mở thêm một process.
  - **Gắn volume bền** cho dữ liệu session của SDK. Không có volume thì restart là mất trí nhớ làm việc (lịch sử trong database vẫn còn).
  - Chạy **một instance**.

## 12. Lưu ý và bẫy đã biết

- **Dùng API key**, không đăng nhập bằng tài khoản claude.ai trong sản phẩm (điều khoản của Anthropic). Không gọi sản phẩm là "Claude Code". Được phép ghi "… Powered by Claude".
- **Google OAuth ở trạng thái Testing thì refresh token hết hạn sau 7 ngày**, làm mail định kỳ tự ngừng. Phải chuyển app sang **In production**. Dùng cá nhân thì không cần xác minh, chỉ bấm qua màn hình cảnh báo.
- **GitHub mời collaborator bằng username**, không bằng email (trừ repo thuộc organization).
- "Làm trên máy" nghĩa là **máy server**. Muốn đụng laptop cá nhân thì cần thêm một agent cục bộ, để làm sau.
- SSE: trình duyệt gọi thẳng backend, không đi qua API route của Vercel (dễ bị timeout).
- Timezone mặc định `Asia/Ho_Chi_Minh` cho mọi lịch.
- Mô tả và phạm vi của agent phải **viết rõ, cụ thể**. Chat chung dựa vào đó để gợi ý đúng agent. Popup tạo agent nên có placeholder/ví dụ để người dùng viết đúng.

## 13. Lộ trình

**Phase 0 — Khung dự án**
- [ ] Monorepo, docker-compose (web, api, postgres)
- [ ] Database cơ bản, tạo sẵn agent `general`
- [ ] Đăng nhập Google, chỉ cho phép email của chủ app

**Phase 1 — Chat chung**
- [ ] Giao diện sidebar: Chat chung trên cùng, mục Agents. Mỗi agent một luồng chat liên tục. Dùng tốt trên điện thoại
- [ ] Chat chạy bằng Agent SDK, stream câu trả lời, nhớ ngữ cảnh trong cuộc chat
- [ ] **Lưu toàn bộ tin nhắn + token + chi phí** vào database
- [ ] Hỏi đáp + tìm kiếm web

**Phase 2 — Khung agent và trí nhớ**
- [ ] Danh sách agent, cấu hình, cấp tool theo agent
- [ ] Nút "+ New agent" + popup tạo/sửa agent (tên, mô tả, hướng dẫn, việc làm được/không, chọn nhóm công cụ, chọn skill, model); tạo xong mở tab Rule
- [ ] Gợi ý agent từ chat chung (thẻ "Mở agent")
- [ ] Quy tắc "ngoài phạm vi thì nói không làm được"
- [ ] Rule của agent: bảng `agent_rules` + lịch sử, tab "Rule" (form thêm/sửa từng rule), nạp rule vào ngữ cảnh theo phạm vi, tool `propose_rule_change`
- [ ] Session SDK xoay vòng theo ngày + tóm tắt mỗi ngày
- [ ] Tự học trí nhớ (hồ sơ người dùng + ghi nhớ agent)
- [ ] Tools `remember`, `forget` + trang "Trí nhớ" (xem, sửa, xoá, ghim)
- [ ] Ghép ngữ cảnh theo mục 5.4, giới hạn phần trí nhớ ~1.500–2.000 token
- [ ] Tool `search_history` (full-text search)
- [ ] Bảng `agent_records` + các tool record dùng chung

**Phase 3 — Agent `mail-action`**
- [ ] Kết nối Gmail
- [ ] Tools danh bạ, soạn mail, gửi mail
- [ ] Skills `weekly-report`, `daily-report`
- [ ] Nhận nội dung report qua chat, lưu `report_entries`, trả bản xem trước
- [ ] Duyệt trước khi gửi (thẻ duyệt trên giao diện)

**Phase 4 — Tự động hoá**
- [ ] Lịch chạy + scheduler + lịch sử chạy
- [ ] Job theo lịch đăng tin nhắn kết quả vào luồng chat + cảnh báo khi thiếu nội dung
- [ ] PWA + thông báo đẩy
- [ ] Trang "Lịch & duyệt" + thống kê chi phí

**Phase 5 — Deploy**
- [ ] Backend lên Railway (có volume), frontend lên Vercel
- [ ] Cấu hình domain, OAuth

**Phase 6 — Mở rộng**
- [ ] Thêm agent mới: GitHub, Calendar, Drive, Slack… qua MCP
- [ ] (Tuỳ chọn) Tìm kiếm lịch sử theo ý nghĩa bằng pgvector
- [ ] (Tuỳ chọn) Chat chung gọi agent như sub-agent để làm hộ
- [ ] (Tuỳ chọn) App điện thoại thật (React Native/Expo hoặc Capacitor)

## 14. Quy ước khi code

- TypeScript `strict` ở mọi package. Validate input bằng **zod**.
- Không hard-code secret. Mọi cấu hình lấy từ env.
- Mỗi tool: mô tả rõ ràng cho model, validate input, trả kết quả ngắn gọn.
- Không hard-code logic riêng cho từng agent. Khác biệt giữa các agent nằm ở cấu hình, hướng dẫn, **rule**, skills và danh sách tool.
- Không hard-code cách làm (format, chữ ký, văn phong…) trong code. Mọi rule nằm trong `agent_rules`.
- Mỗi phase làm xong phải chạy được bằng `docker compose up` trước khi sang phase tiếp theo.
