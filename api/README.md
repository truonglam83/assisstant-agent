# Assistant Agent — Backend API (NestJS)

Backend API phục vụ ứng dụng Trợ lý AI cá nhân (Personal AI Agent), được xây dựng bằng **NestJS (Express Platform)** kết hợp **TypeScript**.

> 💡 **Dành cho bạn muốn học nhanh thực hành không lý thuyết**: Mở ngay file **[NESTJS_GUIDE.md](NESTJS_GUIDE.md)** — Bản hướng dẫn thực chiến dạng cheatsheet/cookbook (công thức 5 bước tạo API, bảng tra cứu decorator, stream SSE, xử lý lỗi).

---

## 1. Vì sao dùng NestJS?

NestJS là framework Node.js chuẩn doanh nghiệp hàng đầu hiện nay:
- **Kiến trúc rõ ràng (Module - Controller - Service)**: Tách biệt triệt để tầng nhận request (Controller), tầng xử lý logic (Service) và tầng gom nhóm tính năng (Module).
- **Dependency Injection (DI)**: Tự động tiêm các dependencies, giúp code dễ viết test, bảo trì và tái sử dụng.
- **Hỗ trợ Streaming SSE mượt mà**: Tích hợp sẵn decorator `@Sse()` hoặc streaming trực tiếp qua HTTP response buffer cho AI LLM token-by-token.
- **DTO Validation chặt chẽ**: Dùng `class-validator` và `class-transformer` để kiểm tra dữ liệu đầu vào tự động ngay từ cửa ngõ API.

---

## 2. Cấu trúc thư mục

```text
api/
├── nest-cli.json             # Cấu hình Nest CLI
├── package.json              # Dependencies và scripts
├── tsconfig.json             # TypeScript config
├── tsconfig.build.json       # Config cho bản build production
└── src/
    ├── main.ts               # File bootstrap: CORS, prefix '/api', ValidationPipe, port 3001
    ├── app.module.ts         # Module gốc (Root Module)
    │
    ├── health/               # Module kiểm tra tình trạng server
    │   ├── health.controller.ts
    │   └── health.module.ts
    │
    └── chat/                 # Module xử lý Chat & Streaming AI
        ├── dto/
        │   └── send-message.dto.ts   # Định nghĩa kiểu dữ liệu & validate đầu vào
        ├── chat.controller.ts        # Tiếp nhận request & điều hướng SSE
        ├── chat.service.ts           # Logic sinh token stream, gọi AI SDK
        └── chat.module.ts            # Đóng gói ChatModule
```

---

## 3. Ba khái niệm cốt lõi của NestJS

### ① Module (`@Module`)
Đóng gói một cụm tính năng độc lập. Khai báo các Controller và Service thuộc về tính năng đó:
```typescript
@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
```

### ② Controller (`@Controller`)
Chịu trách nhiệm nhận HTTP Request (GET, POST, PUT, DELETE...), đọc body/query params và trả về Response cho client:
```typescript
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  sendMessage(@Body() dto: SendMessageDto) {
    return this.chatService.processDirectMessage(dto);
  }
}
```

### ③ Service (`@Injectable`)
Nơi chứa toàn bộ **Business Logic** (truy vấn DB, tính toán, gọi Claude Agent SDK, xử lý SSE stream). Controller chỉ gọi Service chứ không tự làm logic phức tạp.

---

## 4. Cách Streaming Chat (SSE) hoạt động trong NestJS

Có 2 cách xử lý SSE trong NestJS tùy theo luồng người dùng:

### Cách 1: Sử dụng Decorator `@Sse()` với RxJS `Observable`
Phù hợp cho các kết nối SSE dạng mở sẵn kênh lắng nghe:
```typescript
@Sse('stream')
sseStream(): Observable<MessageEvent> {
  return this.chatService.getDemoStream();
}
```

### Cách 2: Stream qua HTTP `POST` trực tiếp (Chuẩn cho Chatbot AI)
Khi người dùng ấn gửi một tin nhắn dài, client gửi `POST /api/chat/stream` kèm body JSON `{ content, agentSlug }`.
Server set header `text/event-stream` và `res.write()` từng từ khi LLM sinh ra:
```typescript
res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
res.setHeader('Cache-Control', 'no-cache, no-transform');
res.setHeader('Connection', 'keep-alive');

// Bắn từng token về client:
res.write(`data: ${JSON.stringify({ type: 'delta', text: 'Xin chào!' })}\n\n`);

// Khi LLM kết thúc:
res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
res.end();
```

---

## 5. DTO Validation với `class-validator`

Mọi dữ liệu gửi lên API đều được kiểm tra tự động trước khi lọt vào Service:

```typescript
export class SendMessageDto {
  @IsString({ message: 'Nội dung tin nhắn phải là chuỗi' })
  @IsNotEmpty({ message: 'Nội dung tin nhắn không được để trống' })
  content!: string;

  @IsOptional()
  @IsString()
  agentSlug?: string;
}
```
Nếu client gửi body rỗng `{}` hoặc sai kiểu, NestJS sẽ tự động trả về HTTP `400 Bad Request` kèm thông báo tiếng Việt chuẩn xác.

---

## 6. Lệnh quản trị & phát triển

| Lệnh | Ý nghĩa |
|---|---|
| `npm run dev` | Khởi động server chế độ phát triển (tự động reload khi sửa code) |
| `npm run check` | Kiểm tra tính đúng đắn của kiểu dữ liệu (`tsc --noEmit`) |
| `npm run build` | Biên dịch ra mã JavaScript production trong thư mục `dist/` |
| `npm run start:prod` | Chạy ứng dụng production đã build (`node dist/main`) |

---

## 7. Thử nghiệm nhanh các Endpoints

### 1. Kiểm tra Health
```bash
curl http://localhost:3001/api/health
```
Kết quả:
```json
{"status":"ok","uptime":12,"timestamp":"2026-10-05T03:17:23.191Z","service":"assistant-agent-api","framework":"NestJS"}
```

### 2. Gửi tin nhắn thường (REST)
```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"content": "Chào NestJS!", "agentSlug": "mail-action"}'
```

### 3. Nhận Stream Chat SSE từ HTTP POST (AI Chatbot)
```bash
curl -N -X POST http://localhost:3001/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"content": "Tóm tắt email mới", "agentSlug": "mail-action"}'
```
Dữ liệu sẽ tuôn ra màn hình theo thời gian thực (token-by-token).
