---
name: frontend-developer
description: Senior Frontend Developer rulebook & coding standards for Next.js (App Router), React 19, TypeScript, and modern Frontend engineering. Concise, high-density coding rules with Senior engineer critiques from basic to advanced.
---

# Senior Frontend Developer — Coding Rules & Standards
> **Ngăn xếp**: Next.js (App Router), React 19, TypeScript, Tailwind CSS  
> **Quality Gate**: Cú pháp, cấm `any`, unused vars, hook deps đã được tự động kiểm soát bởi **ESLint** (`npm run lint`).  
> **Trọng tâm Bộ Skill**: Tập trung vào **Kiến trúc, Tư duy thiết kế, Hiệu năng, Quản lý State và Bảo mật** mà linter không thể tự phát hiện.

---

## 1. Thiết kế Hàm & Logic (Function Design)

### 1.1. Guard Clauses & Early Return (Triệt tiêu kim tự tháp if-else)
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
- 💬 **Senior Note**: *Kim tự tháp if-else lồng nhau làm phân tán não bộ. Bắt điều kiện sai và thoát sớm ngay từ đầu dòng. Luồng chính (happy path) luôn nằm phẳng ở ngoài cùng.*
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

### 1.3. Params Object vs Positional Arguments
- ❌ **Bad (Nghiệp vụ nhiều tham số cùng kiểu)**:
  `function createAgent(name: string, slug: string, prompt: string, model: string, isPublic?: boolean)`
- 💬 **Senior Note**: *Khi hàm nhận từ 3 tham số nghiệp vụ hoặc nhiều biến cùng kiểu `string, string, boolean`, gọi `createAgent("Bot", "bot", "...", "haiku", true)` rất dễ truyền lộn thứ tự. Tuy nhiên, các hàm toán học/utility đơn giản (`clamp(val, min, max)`, `formatDate(date, format)`) thì giữ nguyên positional arguments để tránh rác object.*
- ✅ **Good (Hàm nghiệp vụ ➔ Gom Interface; Hàm Utility ➔ Giữ gọn)**:
  ```typescript
  // Nghiệp vụ: Gom Object Params tự tài liệu hóa
  interface CreateAgentParams {
    name: string;
    slug: string;
    prompt: string;
    model: "haiku" | "sonnet" | "opus";
    isPublic?: boolean;
  }
  function createAgent({ name, slug, prompt, model, isPublic = false }: CreateAgentParams) { ... }

  // Utility đơn giản: Dùng positional tự nhiên
  export const clamp = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max);
  ```

### 1.4. Hàm thuần khiết (Pure Function — Tuyệt đối không Mutate)
- ❌ **Bad**: `tags.push(newTag); return tags;` hoặc `items[i].done = true;`
- 💬 **Senior Note**: *Sửa trực tiếp tham số truyền vào phá vỡ tính bất biến của React state bên ngoài, gây bug không re-render hoặc desync dữ liệu kỳ quái.*
- ✅ **Good**: `return [...tags, newTag];` hoặc `return items.map(item => item.id === id ? { ...item, done: true } : item);`

---

## 2. React Components & UI Architecture

### 2.1. Khai báo Component chuẩn (Loại bỏ `React.FC`)
- ❌ **Bad**: `const AgentCard: React.FC<Props> = (props) => <div>...</div>; export default AgentCard;`
- 💬 **Senior Note**: *`React.FC` làm phức tạp generic types, `export default` làm IDE auto-import đặt tên tuỳ tiện. Luôn dùng Named Function Declaration.*
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
  }, [items, query]); // Thừa 1 lần render vô ích, dễ sinh bug lệch state
  ```
- 💬 **Senior Note**: *Quy tắc tối thượng của React: Thứ gì tính toán được từ Props/State hiện có, TUYỆT ĐỐI KHÔNG LƯU VÀO STATE MỚI VÀ KHÔNG DÙNG useEffect ĐỂ SYNC.*
- ✅ **Good**:
  ```typescript
  // Tính trực tiếp khi render (chỉ bọc useMemo khi mảng > 1000 items)
  const filtered = query.trim()
    ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    : items;
  ```

### 2.3. Semantic HTML & Khử thẻ `div onClick`
- ❌ **Bad**: `<div onClick={handleSave} className="cursor-pointer">Lưu</div>`
- 💬 **Senior Note**: *Lỗi nặng về Accessibility (a11y) và trải nghiệm bàn phím. Phím Tab không focus tới được, không kích hoạt được bằng Enter/Space.*
- ✅ **Good**: `<button type="button" onClick={handleSave}>Lưu</button>`

### 2.4. Tránh lạm dụng `useMemo` & `useCallback`
- ❌ **Bad**: `const upper = useMemo(() => name.toUpperCase(), [name]);`
- 💬 **Senior Note**: *Khởi tạo closure `useMemo` và shallow-compare mảng dependency còn tốn CPU hơn phép toán cơ bản. CHỈ dùng khi phép tính thực sự nặng hoặc cần giữ stable reference truyền xuống component con đã bọc `React.memo`.*

### 2.5. Compound Components thay vì "Monster Props"
- ❌ **Bad**: `<Modal isOpen title="A" showHeader showClose showFooter isDanger confirmText="Xoá" cancelText="Huỷ" />`
- 💬 **Senior Note**: *Component nhận hơn 10 props boolean cấu hình giao diện là vi phạm Open/Closed Principle. Chuyển sang mô hình Compound Components.*
- ✅ **Good**:
  ```typescript
  <Modal isOpen={isOpen} onClose={handleClose}>
    <Modal.Header><Modal.Title>Xoá Agent</Modal.Title></Modal.Header>
    <Modal.Body><p>Bạn có chắc chắn?</p></Modal.Body>
    <Modal.Footer>
      <Button variant="ghost" onClick={handleClose}>Huỷ</Button>
      <Button variant="danger" onClick={handleDelete}>Xoá</Button>
    </Modal.Footer>
  </Modal>
  ```

---

## 3. Quản lý State, Forms & Async Flow (React 19)

### 3.1. Cập nhật State bằng Functional Update
- ❌ **Bad**: `setCount(count + 1); setCount(count + 1);` (Chỉ tăng 1 vì React batching đọc cùng giá trị `count`)
- 💬 **Senior Note**: *Khi state mới phụ thuộc state cũ hoặc được gọi bên trong async callback, bắt buộc dùng functional update.*
- ✅ **Good**: `setCount(prev => prev + 1);`

### 3.2. Discriminated Unions cho Async States (Thay cho nhiều cờ Boolean)
- ❌ **Bad**: `const [isLoading, setIsLoading] = useState(false); const [isError, setIsError] = useState(false);`
- 💬 **Senior Note**: *Nhiều cờ boolean sinh ra trạng thái rác (vừa loading vừa error cùng lúc). Hãy mô hình hóa thành State Machine.*
- ✅ **Good**:
  ```typescript
  type AsyncState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };

  const [state, setState] = useState<AsyncState<Agent[]>>({ status: "idle" });
  ```

### 3.3. Phân định URL as State vs Local Component State
- 💬 **Senior Note**: *Không phải cái gì cũng nhét lên URL! Áp dụng máy móc sẽ làm spam browser history và hỏng nút Back của trình duyệt.*
- ✅ **Quy tắc phân định**:
  - **Lưu trên URL (`searchParams`)**: Page-level Filter, Search chính của trang, Tab điều hướng chính, Phân trang (để F5 không mất, bookmark và copy link chia sẻ được).
  - **Giữ ở local `useState`**: Search/Filter nội bộ bên trong Modal/Dialog, ô tìm kiếm trong Dropdown/Combobox chọn nhanh, Accordion collapse.

### 3.4. React 19 Form Actions & `useActionState` (Khử cờ loading/error thủ công)
- ❌ **Bad**: Tạo thủ công `const [loading, setLoading] = useState(false)` và `const [err, setErr] = useState("")` cho mọi form submit.
- 💬 **Senior Note**: *React 19 và Server Actions đã chuẩn hóa mutation qua hook `useActionState` hoặc `useTransition`. Tự động quản lý pending state và error trả về từ server mà không cần `try/catch/finally` thủ công.*
- ✅ **Good (React 19 Action Pattern)**:
  ```typescript
  "use client";
  import { useActionState } from "react";
  import { updateAgentAction } from "@/app/actions/agent";

  export function EditAgentForm({ agent }: { agent: Agent }) {
    const [state, formAction, isPending] = useActionState(updateAgentAction, null);

    return (
      <form action={formAction}>
        <input name="name" defaultValue={agent.name} />
        {state?.error ? <p className="text-danger-text">{state.error}</p> : null}
        <button type="submit" disabled={isPending}>
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    );
  }
  ```

### 3.5. Optimistic UI với Rollback an toàn
- 💬 **Senior Note**: *Phản hồi 0ms bằng cách cập nhật UI ngay lập tức, gửi request ngầm. Nhưng BẮT BUỘC lưu previous state để rollback và báo lỗi nếu API thất bại.*
- ✅ **Pattern**:
  ```typescript
  const previous = items;
  setItems(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  try {
    await api.toggleItem(id);
  } catch (err) {
    setItems(previous); // Rollback ngay lập tức
    toast.error("Không thể cập nhật, đã khôi phục trạng thái cũ");
  }
  ```

---

## 4. Chuẩn mực TypeScript (Beyond ESLint)

*(Lưu ý: Lỗi dùng `any` hoặc unused variables đã bị ESLint `@typescript-eslint/no-explicit-any` chặn ở bước commit/build. Phần này tập trung vào kỹ thuật thu hẹp kiểu an toàn).*

### 4.1. Type Narrowing / Predicate thay vì ép kiểu mù quáng
- ❌ **Bad**: `const u = data as unknown as User;` (Bịt mắt compiler, runtime thiếu trường vẫn crash).
- 💬 **Senior Note**: *Ép kiểu `as unknown as Type` chỉ là lừa TypeScript lúc viết code. Khi nhận payload từ API ngoài hoặc localStorage, bắt buộc dùng Type Guard kiểm tra thuộc tính trước.*
- ✅ **Good (Type Guard / Predicate)**:
  ```typescript
  function isUser(val: unknown): val is { name: string; email: string } {
    return typeof val === "object" && val !== null && "name" in val && "email" in val;
  }
  function handle(res: unknown): string {
    return isUser(res) ? res.name : "Khách";
  }
  ```

### 4.2. Tận dụng Utility Types (`Pick`, `Omit`, `Partial`, `Readonly`)
- ❌ **Bad**: Copy-paste tạo 3 interface lặp lại: `Agent`, `CreateAgentPayload`, `UpdateAgentPayload`.
- ✅ **Good**:
  ```typescript
  export interface Agent { readonly id: string; name: string; model: string; readonly createdAt: string; }
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

## 5. Next.js App Router (RSC, Boundaries & Security)

### 5.1. Ranh giới Server/Client hợp lý (Pragmatic Boundaries)
- 💬 **Senior Note**:
  - **Trang Content / SEO / Dashboard hiển thị**: Giữ `page.tsx` và `layout.tsx` là Server Component (RSC), đẩy `"use client"` xuống lá cây (Leaf Components).
  - **Trang Rich Interactive Workspace (như Chat Room, Editor, Canvas)**: Cho phép đặt `"use client"` ở Feature Container cấp cao để quản lý state machine, websocket/SSE stream liền mạch, tránh bẫy Props Drilling quá sâu.

### 5.2. Next.js 15/16 Async Request APIs (`params`, `searchParams`)
- ❌ **Bad (Kiểu cũ Next.js 14)**:
  ```typescript
  export default function Page({ params }: { params: { slug: string } }) {
    console.log(params.slug); // ❌ Lỗi hoặc cảnh báo đỏ lúc build trên Next 15/16!
  }
  ```
- 💬 **Senior Note**: *Từ Next.js 15+, `params` và `searchParams` là Promise. Bắt buộc khai báo async và await.*
- ✅ **Good**:
  ```typescript
  export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ q?: string }>;
  }) {
    const { slug } = await params;
    const { q } = await searchParams;
  }
  ```

### 5.3. Chống Rò rỉ Dữ liệu Nhạy cảm qua RSC Payload (DTO Pattern)
- ❌ **Bad**:
  ```typescript
  // Server Component
  const user = await db.user.findFirst();
  return <UserCard user={user} />; // ❌ Toàn bộ hash password, secret keys bị gửi về client!
  ```
- 💬 **Senior Note**: *Dữ liệu truyền qua Props từ Server sang Client Component được serialize thành JSON trong RSC payload (xem được trong Network tab). Tuyệt đối không pass cả DB entity gốc.*
- ✅ **Good**: Dùng DTO hoặc `select` lọc đúng các trường công khai cho UI:
  ```typescript
  const safeUser = { id: user.id, name: user.name, avatar: user.avatar };
  return <UserCard user={safeUser} />;
  ```

### 5.4. Revalidation bắt buộc sau Mutation
- 💬 **Senior Note**: *Next.js cache dữ liệu rất hung hãn. Sửa database xong mà không revalidate thì người dùng vẫn nhìn thấy dữ liệu cũ.*
- ✅ **Good**:
  - Trong Server Action: Gọi `revalidatePath("/agents")` hoặc `revalidateTag("agents")`.
  - Trong Client Component sau khi gọi API REST: Gọi `router.refresh()` nếu trang hiển thị dữ liệu server.

### 5.5. Triệt tiêu Data Waterfall bằng `Promise.all`
- ❌ **Bad**: `const a = await getA(); const b = await getB();` (Chờ tuần tự, tốn 2x thời gian).
- ✅ **Good**: `const [a, b] = await Promise.all([getA(), getB()]);` (Chạy song song).

### 5.6. Phân rã Suspense & Route Error Boundary bắt buộc
- 💬 **Senior Note**: *Đừng để 1 API chậm làm trắng cả trang web, và đừng để 1 API lỗi làm crash cả ứng dụng.*
- ✅ **Good**:
  - Bọc component fetch dữ liệu nặng trong `<Suspense fallback={<Skeleton />}>`.
  - Mỗi route segment nghiệp vụ phải có file `loading.tsx` và `error.tsx` (Client Component) để xử lý lỗi tại chỗ có nút thử lại (retry).

---

## 6. Bẫy lỗi Runtime & UX (Senior Trap Checklist)

*(Những lỗi runtime tinh vi mà linter tĩnh không thể bắt được)*

| # | Bẫy lỗi (Anti-pattern) | Hậu quả | Cách giải quyết chuẩn Senior |
|---|---|---|---|
| **1** | Quên return cleanup trong `useEffect` | Memory leak listener, bắn API trùng lặp khi re-render | Luôn return hàm `() => window.removeEventListener(...)` / `clearInterval(...)` |
| **2** | Nuốt lỗi bằng `catch (e) {}` rỗng | Bug trên production không ai biết nguyên nhân | Phải log có ngữ cảnh hoặc trả về `{ success: false, error }` / Toast lỗi |
| **3** | Đọc `window` / `localStorage` trong render ban đầu | Crash Hydration Mismatch trên Next.js | Dùng `useSyncExternalStore` hoặc đọc trong `useEffect` sau khi mount |
| **4** | Thiếu `try/finally` ở async button handler | Nút bấm kẹt vĩnh viễn ở trạng thái `pending` khi mạng lỗi | Luôn đặt `setPending(false)` bên trong khối `finally` |
| **5** | Không rollback khi Optimistic Update lỗi | UI hiển thị trạng thái ảo, lệch với database | Lưu snapshot state cũ và khôi phục lại trong khối `catch` |
| **6** | Truyền raw entity database từ RSC sang Client | Lộ dữ liệu nhạy cảm (passwords, tokens) ra client | Dùng DTO Pattern hoặc `select` chỉ truyền trường UI cần |
