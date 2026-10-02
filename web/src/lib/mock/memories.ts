// Dữ liệu mẫu — xem docs/DATABASE.md §3 (`memories`). Không có mockup ảnh cho
// trang này — tự thiết kế theo mô tả IDEAS.md §5.3d. Liên kết bằng `agentId`.

export type MemoryCategory = "profile" | "preference" | "person" | "project";
export type MemorySource = "auto" | "explicit" | "edit";

export type MockMemory = {
  id: string;
  agentId?: string; // trống = hồ sơ chung, mọi agent đọc được
  category: MemoryCategory;
  content: string;
  source: MemorySource;
  pinned: boolean;
};

const MOCK_MEMORIES: MockMemory[] = [
  {
    id: "mm_01",
    category: "profile",
    content: "Tên Tuấn, backend developer, làm việc 9h–18h",
    source: "auto",
    pinned: true,
  },
  {
    id: "mm_02",
    category: "preference",
    content: "Thích câu trả lời ngắn gọn, tiếng Việt, xưng mình/bạn",
    source: "explicit",
    pinned: true,
  },
  {
    id: "mm_03",
    category: "person",
    content: "Sếp là anh Minh (minh@company.com), team gồm chị Lan",
    source: "auto",
    pinned: false,
  },
  {
    id: "mm_04",
    category: "project",
    content: "Đang làm dự án Personal AI Agent (Next.js + Hono)",
    source: "auto",
    pinned: false,
  },
  {
    id: "mm_06",
    agentId: "ag_mail",
    category: "preference",
    content: "Thường nhắn nội dung report khoảng 6h30, report tự gửi lúc 7h",
    source: "auto",
    pinned: false,
  },
  {
    id: "mm_07",
    agentId: "ag_mail",
    category: "preference",
    content: "Không thích câu chào mở đầu dài dòng",
    source: "edit",
    pinned: false,
  },
];

export function getMockMemoriesForAgent(agentId: string): MockMemory[] {
  return MOCK_MEMORIES.filter((m) => m.agentId === agentId);
}

export function getMockSharedMemories(): MockMemory[] {
  return MOCK_MEMORIES.filter((m) => !m.agentId);
}
