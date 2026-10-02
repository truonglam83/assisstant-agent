# 04 — Agent

> Trạng thái: **Khung**

## 1. Mục tiêu

Chạy agent thật bằng Claude Agent SDK phía sau API: mỗi agent đúng prompt, rule, tool, skill của nó; quản lý ngữ cảnh và trí nhớ; duyệt hành động; chạy việc theo lịch.

## 2. Tham chiếu ý tưởng

- [IDEAS.md](../IDEAS.md) §1.2–1.6 (agent, mail-action, tạo agent), §2 (nguyên tắc), §5 (ngữ cảnh, trí nhớ, rule, tiết kiệm token), §7 (luồng chính), §8 (tools), §12 (bẫy đã biết)

## 3. Các phần

### 3.1. Agent registry và runner
- Đọc cấu hình agent từ DB
- Gọi SDK với đúng model, tool, skill, giới hạn số bước
- Stream kết quả ra API (sự kiện SSE ở 02)
- Tắt các tool có sẵn không dùng (Bash, Write, Edit…)

### 3.2. Ghép ngữ cảnh
- Thứ tự: instructions → rules → hồ sơ người dùng → ghi nhớ agent → tóm tắt gần đây → ngày giờ
- Chọn rule theo phạm vi, chọn trí nhớ trong giới hạn token
- Chụp ngữ cảnh một lần mỗi ngày để giữ cache

### 3.3. Session và trí nhớ
- Session SDK xoay vòng theo ngày, tóm tắt cuối ngày
- Job tự học trí nhớ (thêm / sửa / xoá)
- `remember`, `forget`, `search_history`
- Dựng lại ngữ cảnh khi mất dữ liệu session

### 3.4. Tool
- Tool chung: `list_rules`, `propose_rule_change`, `search_history`, `remember`, `forget`, các tool `*_record`
- Tool chat chung: `list_agents`, `get_agent_info`, `suggest_agent`, web search/fetch
- Tool mail-action: danh bạ, `draft_email`, `send_email`, các tool lịch
- Nhóm tool để tick trong popup tạo agent

### 3.5. Rule và skill
- Nạp rule vào ngữ cảnh
- Luồng đề xuất sửa rule qua chat
- Skill: định nghĩa, cấp cho agent, nạp khi chạy
- Skill `daily-report`, `weekly-report`

### 3.6. Duyệt hành động
- Chặn việc cần duyệt, tạo `approvals`, chờ người dùng, chạy tiếp hoặc dừng

### 3.7. Lịch và job nền
- Scheduler (pg-boss): tạo, sửa, huỷ lịch
- Job report: lấy `report_entries`, soạn, gửi hoặc chờ duyệt, đăng tin `event`, gửi push
- Thiếu nội dung: cảnh báo, nhắc trước giờ gửi
- Job tóm tắt và tự học trí nhớ

### 3.8. Chi phí
- Ghi token và chi phí mỗi lượt và mỗi lần chạy lịch
- Ngưỡng cảnh báo

## 4. Cần chốt

- [ ] Tool tự viết được đưa vào SDK thế nào
- [ ] Cơ chế duyệt: agent dừng chờ trong cùng lượt hay kết thúc lượt rồi chạy lại khi duyệt
- [ ] Nơi lưu dữ liệu session SDK và thư mục làm việc của từng agent
- [ ] Skill: định nghĩa ở đâu, gắn với agent thế nào, khác rule ở điểm nào
- [ ] Model cụ thể cho từng việc (chat chung, agent, tóm tắt, tự học)
- [ ] Cách đếm token để giữ giới hạn trí nhớ
- [ ] Khi nào kích hoạt job tự học (im lặng 30 phút, cuối ngày) và cách hiện thực
- [ ] Chọn trí nhớ "liên quan": từ khoá hay cách khác ở giai đoạn đầu
- [ ] Rule quá nhiều: ngưỡng và cách nạp theo tên
- [ ] Chat chung gợi ý agent: dựa vào dữ liệu nào, format thẻ gợi ý
- [ ] Giới hạn số bước (`maxTurns`) và ngưỡng chi phí
- [ ] Xử lý lỗi khi gọi model, khi gửi mail thất bại, khi job chạy trùng

## 5. Đã chốt

_(chưa có)_

## 6. Việc cần làm

_(viết sau khi chốt)_
