// Dữ liệu mẫu cho luồng chat — dùng để dựng UI lazy-load (lướt lên tải tin cũ)
// trước khi có mock API/backend thật. Đuôi mỗi conversation khớp kịch bản
// trong docs/DATABASE.md §3; phần đầu là tin filler để có đủ dữ liệu demo scroll.
// Key theo agentId (như mọi mock khác) — không phải slug.

import { GENERAL_AGENT_ID } from "@/lib/mock/agents";

export type MockMessageRole = "user" | "assistant" | "event" | "date";

export type MockMessage = {
  id: string;
  role: MockMessageRole;
  content: string;
  time?: string; // chỉ dùng cho role "event", ví dụ "07:00"
};

const FILLER_TOPICS: Array<[string, string]> = [
  [
    "Giải thích async/await trong JS giúp mình",
    "async/await là cú pháp giúp viết code bất đồng bộ trông giống code đồng bộ, dựa trên Promise.",
  ],
  [
    "Dịch câu này sang tiếng Anh: Tôi đang học lập trình",
    '"I am learning programming."',
  ],
  [
    "Sự khác nhau giữa let và const?",
    "let khai báo biến có thể gán lại giá trị, const thì không gán lại được (nhưng nếu là object/array thì vẫn sửa được nội dung bên trong).",
  ],
  [
    "Tóm tắt ngắn gọn REST API là gì",
    "REST API là cách thiết kế API dựa trên HTTP, dùng các method GET/POST/PUT/DELETE cho các thao tác CRUD.",
  ],
  [
    "Cho ví dụ về closure trong JavaScript",
    "Closure là khi hàm con vẫn nhớ được biến của hàm cha, kể cả sau khi hàm cha đã chạy xong.",
  ],
  [
    "SSR và CSR khác nhau thế nào?",
    "SSR render HTML trên server rồi gửi về, CSR render bằng JS ngay trên trình duyệt sau khi tải xong.",
  ],
];

function buildFiller(pairs: number, seed: number, dateLabel: string): MockMessage[] {
  const out: MockMessage[] = [{ id: `f_${seed}_date`, role: "date", content: dateLabel }];
  for (let i = 0; i < pairs; i += 1) {
    const [q, a] = FILLER_TOPICS[(i + seed) % FILLER_TOPICS.length];
    out.push({ id: `f_${seed}_${i}_u`, role: "user", content: q });
    out.push({ id: `f_${seed}_${i}_a`, role: "assistant", content: a });
  }
  return out;
}

const GENERAL_TAIL: MockMessage[] = [
  { id: "ms_g_date", role: "date", content: "Thứ Ba, 29/09" },
  { id: "ms_g1", role: "user", content: "Mail weekly nên gửi lúc mấy giờ thì ổn?" },
  {
    id: "ms_g2",
    role: "assistant",
    content:
      "Thường nên gửi sáng thứ Sáu khoảng 7h–8h30, trước khi mọi người vào việc. Sếp đọc được tổng kết tuần ngay đầu ngày và còn thời gian phản hồi trước cuối tuần.",
  },
  { id: "ms_g3", role: "user", content: "Giờ mình muốn viết và gửi daily report" },
  {
    id: "ms_g4",
    role: "assistant",
    content:
      "Việc này agent mail-action làm được. Bạn mở agent rồi nhắn người nhận và nội dung, agent sẽ soạn theo rule daily report.",
  },
];

const MAIL_ACTION_TAIL: MockMessage[] = [
  { id: "ms_10_date", role: "date", content: "Thứ Hai, 28/09" },
  {
    id: "ms_10",
    role: "user",
    content:
      "Lịch 7h gửi mail daily report hằng sáng. Sáng thứ 6 thì gửi thêm weekly report cũng lúc 7h.",
  },
  {
    id: "ms_11",
    role: "assistant",
    content:
      "Đã tạo 2 lịch: Daily report 7h thứ 2–6, Weekly report 7h thứ 6. Người nhận: anh Minh (to), chị Lan (cc). Trước 7h bạn nhắn nội dung cho mình nhé.",
  },
  { id: "ms_20_date", role: "date", content: "Thứ Năm, 01/10" },
  { id: "ms_20", role: "user", content: "Hôm qua đã làm API đăng nhập, todo: trang chat." },
  {
    id: "ms_21",
    role: "assistant",
    content:
      "Đã ghi nhận cho daily report hôm nay. 7h mình sẽ gửi. Muốn sửa thì nhắn trước 7h.",
  },
  {
    id: "ms_22",
    role: "event",
    time: "07:00",
    content:
      "Đã gửi daily report · [Daily Report] 01/10/2026 · To: minh@company.com · Cc: lan@company.com",
  },
  { id: "ms_30_date", role: "date", content: "Thứ Sáu, 02/10" },
  {
    id: "ms_30",
    role: "user",
    content:
      "Hôm qua làm trang chat, todo: kết nối Gmail. Weekly: tuần này xong đăng nhập và chat, tuần sau làm agent mail.",
  },
  {
    id: "ms_31",
    role: "assistant",
    content: "Đã ghi nhận cho cả daily và weekly report hôm nay. Bản xem trước bạn xem lại giúp mình nhé.",
  },
  {
    id: "ms_32",
    role: "event",
    time: "07:00",
    content:
      "Đã gửi daily report · [Daily Report] 02/10/2026 · To: minh@company.com · Cc: lan@company.com",
  },
  {
    id: "ms_33",
    role: "event",
    time: "07:00",
    content:
      "Đã gửi weekly report · [Weekly Report] Tuần 40 (28/09 – 02/10) · To: minh@company.com · Cc: lan@company.com",
  },
];

// Mỗi conversation: mảng theo thứ tự CŨ → MỚI (giống thứ tự thật trong DB).
export const MOCK_MESSAGES: Record<string, MockMessage[]> = {
  [GENERAL_AGENT_ID]: [
    ...buildFiller(4, 1, "Thứ Sáu, 25/09"),
    ...buildFiller(4, 3, "Thứ Hai, 28/09"),
    ...GENERAL_TAIL,
  ],
  ag_mail: [
    ...buildFiller(3, 0, "Thứ Sáu, 25/09"),
    ...buildFiller(3, 2, "Chủ Nhật, 27/09"),
    ...MAIL_ACTION_TAIL,
  ],
};

export const MOCK_MESSAGE_PAGE_SIZE = 12;

/** Lấy một trang tin nhắn, tính từ trước tin `beforeId` (không truyền = trang mới nhất). */
export function getMockMessagePage(
  conversationKey: string,
  beforeId?: string,
): { messages: MockMessage[]; hasMore: boolean } {
  const all = MOCK_MESSAGES[conversationKey] ?? [];
  const endIndex = beforeId ? all.findIndex((m) => m.id === beforeId) : all.length;
  const safeEnd = endIndex === -1 ? all.length : endIndex;
  const startIndex = Math.max(0, safeEnd - MOCK_MESSAGE_PAGE_SIZE);
  return {
    messages: all.slice(startIndex, safeEnd),
    hasMore: startIndex > 0,
  };
}
