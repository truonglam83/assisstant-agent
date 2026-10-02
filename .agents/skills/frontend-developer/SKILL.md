---
name: frontend-developer
description: Senior Frontend Developer rulebook & coding standards for Next.js (App Router), React 19, TypeScript, and modern Frontend engineering. Concise, high-density coding rules with Senior engineer critiques from basic to advanced.
---

# Senior Frontend Developer — Coding Rules & Standards
> **Ngăn xếp**: Next.js (App Router), React 19, TypeScript, Tailwind CSS  
> **Tôn chỉ Senior**: Viết tường minh hơn mẹo mực • Không lưu vào state thứ có thể tính toán được • Tôn trọng ranh giới Server/Client.

---

## 1. Thiết kế Hàm & Logic (Function Design)

### 1.1. Guard Clauses & Early Return
- ❌ **Bad**:
  ```typescript
  function getDiscount(user: User | null, product: Product | null) {
    if (user && user.isActive) {
      if (product && product.inStock) {
        return user.isVip ? product.price * 0.8 : product.price * 0.95;
      }
    }
    return 0;
  }
  ```
- 💬 **Senior Note**: *Kim tự tháp if-else lồng nhau làm phân tán não bộ. Bắt điều kiện sai và thoát sớm ngay từ đầu dòng. Luồng chính (happy path) luôn nằm thẳng hàng.*
- ✅ **Good**:
  ```typescript
  function getDiscount(user: User | null, product: Product | null): number {
    if (!user?.isActive || !product?.inStock) return 0;
    return product.price * (user.isVip ? 0.8 : 0.95);
  }
  ```

### 1.2. Đặt tên hàm: Động từ + Danh từ (Verb + Noun)
- ❌ **Bad**: `data(id)`, `process(item)`, `userCheck(u)`, `handleInfo()`
- 💬 **Senior Note**: *Hàm phải là một hành động rõ ràng. Đặt tên mù mờ buộc người đọc phải mở ruột hàm ra xem.*
- ✅ **Good**:
  - Lấy dữ liệu: `getUserById(id)`, `fetchActiveAgents()`
  - Kiểm tra boolean: `isValidEmail(email)`, `hasAccess(user, role)`
  - Chuyển đổi: `formatCurrency(val)`, `toAgentOption(agent)`
  - Xử lý sự kiện: `handleSubmit()`, `handleDeleteAgent(id)`

### 1.3. Gom nhóm tham số (> 2 tham số ➔ Params Object)
- ❌ **Bad**: `function createAgent(name: string, model: string, prompt: string, maxTokens: number, isPublic?: boolean)`
- 💬 **Senior Note**: *Gọi `createAgent("Bot", "sonnet", "...", 4000, true)` là bẫy nhầm lẫn thứ tự tham số. Hãy gom thành Interface.*
- ✅ **Good**:
  ```typescript
  interface CreateAgentParams {
    name: string;
    model: "haiku" | "sonnet" | "opus";
    prompt: string;
    maxTokens?: number;
    isPublic?: boolean;
  }
  function createAgent({ name, model, prompt, maxTokens = 4096, isPublic = false }: CreateAgentParams) { ... }
  ```

### 1.4. Hàm thuần khiết (Pure Function — Tuyệt đối không Mutate)
- ❌ **Bad**: `tags.push(newTag); return tags;` hoặc `items[i].done = true;`
- 💬 **Senior Note**: *Sửa trực tiếp tham số truyền vào phá vỡ state của React bên ngoài, gây bug không re-render hoặc desync dữ liệu.*
- ✅ **Good**: `return [...tags, newTag];` hoặc `return items.map(item => item.id === id ? { ...item, done: true } : item);`

---

## 2. React Components & UI Architecture

### 2.1. Khai báo Component chuẩn (Loại bỏ `React.FC`)
- ❌ **Bad**: `const AgentCard: React.FC<Props> = (props) => <div>...</div>; export default AgentCard;`
- 💬 **Senior Note**: *`React.FC` làm phức tạp generics, export default làm sai lệch auto-import. Dùng Named Function Declaration.*
- ✅ **Good**:
  ```typescript
  export interface AgentCardProps {
    agent: Agent;
    onSelect?: (id: string) => void;
    className?: string;
  }
  export function AgentCard({ agent, onSelect, className = "" }: AgentCardProps) {
    return (
      <button type="button" onClick={() => onSelect?.(agent.id)} className={className}>
        {agent.name}
      </button>
    );
  }
  ```

### 2.2. Triệt tiêu bẫy State phái sinh (Derived State Anti-pattern)
- ❌ **Bad**:
  ```typescript
  const [filtered, setFiltered] = useState<Item[]>([]);
  useEffect(() => {
    setFiltered(items.filter(i => i.name.includes(query)));
  }, [items, query]); // Thừa 1 lần render, dễ desync state
  ```
- 💬 **Senior Note**: *Quy tắc tối thượng: Thứ gì tính toán được từ Props/State hiện có, TUYỆT ĐỐI KHÔNG LƯU VÀO STATE MỚI.*
- ✅ **Good**:
  ```typescript
  // Tính trực tiếp khi render (chỉ bọc useMemo khi mảng > 1000 items)
  const filtered = query.trim()
    ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    : items;
  ```

### 2.3. Semantic HTML & Khử thẻ `div onClick`
- ❌ **Bad**: `<div onClick={handleSave} className="cursor-pointer">Lưu</div>`
- 💬 **Senior Note**: *Lỗi nặng về Accessibility (a11y) và phím bấm. Bàn phím không Tab tới được, không Enter/Space được.*
- ✅ **Good**: `<button type="button" onClick={handleSave}>Lưu</button>`

### 2.4. Tránh lạm dụng `useMemo` & `useCallback`
- ❌ **Bad**: `const upper = useMemo(() => name.toUpperCase(), [name]);`
- 💬 **Senior Note**: *Khởi tạo closure `useMemo` và shallow-compare mảng dependency còn tốn CPU hơn phép toán cơ bản. CHỈ dùng khi phép tính thực sự nặng hoặc truyền hàm xuống component con đã bọc `React.memo`.*

---

## 3. Quản lý State & Async Flow

### 3.1. Cập nhật State bằng Functional Update
- ❌ **Bad**: `setCount(count + 1); setCount(count + 1);` (Chỉ tăng 1 vì batching đọc cùng giá trị `count`)
- 💬 **Senior Note**: *Khi state mới phụ thuộc state cũ hoặc gọi trong async callback, bắt buộc dùng `prev =>`.*
- ✅ **Good**: `setCount(prev => prev + 1);`

### 3.2. Discriminated Unions cho Async States (Thay cho nhiều cờ Boolean)
- ❌ **Bad**: `const [isLoading, setIsLoading] = useState(false); const [isError, setIsError] = useState(false);`
- 💬 **Senior Note**: *Nhiều cờ boolean sinh ra trạng thái rác (vừa loading vừa error). Hãy gom thành State Machine.*
- ✅ **Good**:
  ```typescript
  type AsyncState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };

  const [state, setState] = useState<AsyncState<Agent[]>>({ status: "idle" });
  ```

### 3.3. URL as Source of Truth
- ❌ **Bad**: Lưu `searchQuery`, `currentTab`, `pageIndex` vào `useState` nội bộ (Reload trang F5 bị mất sạch).
- 💬 **Senior Note**: *Search, Filter, Tab, Pagination phải lưu trên URL `searchParams` để người dùng có thể chia sẻ link hoặc bookmark.*
- ✅ **Good**: Dùng `useSearchParams` và `router.replace('?tab=active')`.

### 3.4. Optimistic UI với Rollback an toàn
- 💬 **Senior Note**: *Phản hồi 0ms bằng cách cập nhật UI trước, gửi request ngầm dưới nền. Nếu lỗi thì khôi phục lại state cũ.*
- ✅ **Pattern**:
  ```typescript
  const previous = items;
  setItems(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  try {
    await api.toggleItem(id);
  } catch (err) {
    setItems(previous); // Rollback nếu lỗi
    toast.error("Không thể cập nhật, đã khôi phục");
  }
  ```

---

## 4. Chuẩn mực TypeScript thực chiến

### 4.1. Cấm tuyệt đối `any` — Dùng `unknown` + Type Narrowing
- ❌ **Bad**: `function handleResponse(res: any) { return res.data.user.name; }`
- 💬 **Senior Note**: *`any` là virus vô hiệu hóa TypeScript. Khi nhận dữ liệu ngoại vi chưa rõ kiểu, dùng `unknown` và kiểm tra an toàn.*
- ✅ **Good**:
  ```typescript
  function isUser(val: unknown): val is { name: string } {
    return typeof val === "object" && val !== null && "name" in val;
  }
  function handleResponse(res: unknown): string {
    return isUser(res) ? res.name : "Khách";
  }
  ```

### 4.2. Tận dụng Utility Types (`Pick`, `Omit`, `Partial`)
- ❌ **Bad**: Copy-paste tạo 3 interface giống nhau: `Agent`, `CreateAgentPayload`, `UpdateAgentPayload`.
- ✅ **Good**:
  ```typescript
  export interface Agent { id: string; name: string; model: string; createdAt: string; }
  export type CreateAgentPayload = Omit<Agent, "id" | "createdAt">;
  export type UpdateAgentPayload = Partial<CreateAgentPayload>;
  export type AgentOption = Pick<Agent, "id" | "name">;
  ```

### 4.3. Dùng `as const` thay cho TypeScript Enums
- ❌ **Bad**: `enum Status { Active = "ACTIVE", Draft = "DRAFT" }` (Sinh mã JS cồng kềnh, kém tương thích tree-shaking)
- ✅ **Good**:
  ```typescript
  export const STATUS = { ACTIVE: "active", DRAFT: "draft" } as const;
  export type Status = (typeof STATUS)[keyof typeof STATUS]; // "active" | "draft"
  ```

---

## 5. Next.js App Router & Ranh giới Server/Client

### 5.1. Quy tắc đẩy `"use client"` xuống lá cây (Leaf Component)
- ❌ **Bad**: Đặt `"use client"` trên đầu file `page.tsx` hoặc `layout.tsx`.
- 💬 **Senior Note**: *Đặt `"use client"` ở root biến toàn bộ cây component thành Client JS bundle. Hãy giữ `page.tsx` là Server Component (RSC), chỉ bọc `"use client"` ở nút bấm, modal, form tương tác.*

### 5.2. Triệt tiêu Data Waterfall bằng `Promise.all`
- ❌ **Bad**: Chờ tuần tự `const a = await getA(); const b = await getB();` (Mất 2x thời gian).
- ✅ **Good**: `const [a, b] = await Promise.all([getA(), getB()]);` (Chạy song song).

### 5.3. Bảo mật Server Actions & Bảo vệ Secret
- 💬 **Senior Note**: *Mọi Server Action là một HTTP POST công khai. Bắt buộc kiểm tra session đăng nhập và validate input.*
- ✅ **Pattern**:
  ```typescript
  "use server";
  import "server-only"; // Chống rò rỉ mã sang client bundle

  export async function deleteItemAction(rawId: string) {
    const user = await getSession();
    if (!user) throw new Error("Unauthorized");
    const id = z.string().uuid().parse(rawId);
    await db.delete(id);
  }
  ```

---

## 6. Bẫy lỗi Kinh điển (Senior Trap Checklist)

| # | Bẫy lỗi (Anti-pattern) | Hậu quả | Cách giải quyết |
|---|---|---|---|
| **1** | Object/Array inline trong `useEffect` dependency | Vòng lặp re-render vô tận (Infinite Loop) | Đưa ra ngoài component hoặc chỉ phụ thuộc vào primitive ID/string |
| **2** | Quên return cleanup trong `useEffect` | Memory leak listener, bắn API lặp lại | Luôn return hàm `() => removeEventListener(...)` / `clearInterval(...)` |
| **3** | Dùng `key={index}` khi render danh sách động | Lệch state của form, checkbox khi xoá/sắp xếp | Luôn dùng ID duy nhất và bất biến: `key={item.id}` |
| **4** | Nuốt lỗi bằng `catch (e) {}` rỗng | Bug trên production không ai biết nguyên nhân | Phải log có ngữ cảnh hoặc trả về `{ success: false, error }` |
| **5** | Đọc `window` / `localStorage` trong render ban đầu | Crash Hydration Mismatch trên Next.js | Đọc trong `useEffect` sau khi component đã mount |
