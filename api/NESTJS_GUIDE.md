# Hướng Dẫn Thực Hành NestJS (Thực Chiến - Không Lý Thuyết)

> Tài liệu học nhanh dạng **Cookbook / Cheatsheet**: Cần làm tính năng gì thì mở đúng mục đó ra, copy mẫu code và sửa lại.

---

## 1. Bản Đồ 1 Request Chạy Thế Nào?

Khi người dùng hoặc Frontend gửi 1 request, dữ liệu sẽ đi tuần tự qua đúng 4 trạm:

```text
Frontend (gọi API)
       │
       ▼
 [1. Controller]  ──► Nhận URL, bóc tách Body/Param, kiểm tra DTO hợp lệ chưa
       │
       ▼
 [2. Service]     ──► Xử lý logic, tính toán, gọi DB, gọi Claude Agent SDK
       │
       ▼
 [3. Response]    ──► Trả JSON hoặc bắn luồng SSE về lại Frontend
```

Tất cả Controller và Service của 1 tính năng được bọc trong một **Module**.

---

## 2. Công Thức 5 Bước: Tạo Một API Mới Từ A Đến Z

Ví dụ: Bạn muốn tạo API quản lý Rules của Agent (`/api/rules`).

### Bước 1: Tạo thư mục tính năng
Tạo folder: `src/rules/` và thư mục con `src/rules/dto/`.

### Bước 2: Tạo DTO để nhận và validate dữ liệu (`src/rules/dto/create-rule.dto.ts`)
```typescript
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateRuleDto {
  @IsString({ message: 'Nội dung rule phải là chữ' })
  @IsNotEmpty({ message: 'Nội dung rule không được để trống' })
  content!: string;

  @IsString()
  @IsNotEmpty()
  agentId!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

### Bước 3: Tạo Service chứa logic (`src/rules/rules.service.ts`)
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';

@Injectable()
export class RulesService {
  // Tạm lưu trong memory (sau này thay bằng DB)
  private rules: Array<{ id: string; content: string; agentId: string; isActive: boolean }> = [];

  getAll(agentId?: string) {
    if (agentId) {
      return this.rules.filter((r) => r.agentId === agentId);
    }
    return this.rules;
  }

  create(dto: CreateRuleDto) {
    const newRule = {
      id: `rule-${Date.now()}`,
      content: dto.content,
      agentId: dto.agentId,
      isActive: dto.isActive ?? true,
    };
    this.rules.push(newRule);
    return newRule;
  }

  delete(id: string) {
    const index = this.rules.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy rule với ID: ${id}`);
    }
    const [deleted] = this.rules.splice(index, 1);
    return deleted;
  }
}
```

### Bước 4: Tạo Controller định nghĩa URL (`src/rules/rules.controller.ts`)
```typescript
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';

@Controller('rules') // Prefix URL: /api/rules
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  // GET /api/rules hoặc GET /api/rules?agentId=agent-1
  @Get()
  getList(@Query('agentId') agentId?: string) {
    return this.rulesService.getAll(agentId);
  }

  // POST /api/rules
  @Post()
  createRule(@Body() dto: CreateRuleDto) {
    return this.rulesService.create(dto);
  }

  // DELETE /api/rules/:id
  @Delete(':id')
  deleteRule(@Param('id') id: string) {
    return this.rulesService.delete(id);
  }
}
```

### Bước 5: Khai báo vào Module và cắm vào `app.module.ts`
Tạo `src/rules/rules.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';

@Module({
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService], // Chỉ cần khi module khác muốn xài RulesService
})
export class RulesModule {}
```

Sau đó mở `src/app.module.ts`, thêm `RulesModule` vào danh sách `imports`:
```typescript
@Module({
  imports: [HealthModule, ChatModule, RulesModule], // Thêm vào đây
})
export class AppModule {}
```
**Xong!** Server đang chạy sẽ tự reload và bạn đã có ngay 3 endpoint: `GET /api/rules`, `POST /api/rules`, `DELETE /api/rules/:id`.

---

## 3. Cheatsheet Lấy Dữ Liệu Từ Request (Dùng 90% mỗi ngày)

Trong Controller, bạn chỉ cần nhớ các Decorator sau để lấy data:

| Bạn muốn lấy gì? | Viết như thế này trong Controller | Ví dụ cURL / URL tương ứng |
|---|---|---|
| **Body JSON** | `@Body() dto: MyDto` | `POST` kèm body `{"content": "..."}` |
| **URL Param (`:id`)** | `@Param('id') id: string` | `/api/rules/rule-123` |
| **URL Query (`?page=1`)** | `@Query('page') page: string` | `/api/rules?page=1&limit=10` |
| **Lấy hết Query** | `@Query() query: any` | Lấy toàn bộ object query params |
| **Header** | `@Headers('authorization') token: string` | Header `Authorization: Bearer xyz` |
| **Đổi HTTP Status** | `@HttpCode(204)` | Khi xóa thành công trả về 204 No Content |

---

## 4. Cách Bắn Lỗi Chuẩn HTTP (Exception)

Không tự viết object `{ error: "lỗi" }`. NestJS có sẵn các hàm ném lỗi chuẩn HTTP:

```typescript
import { 
  BadRequestException,   // 400: Dữ liệu gửi lên sai quy định
  UnauthorizedException, // 401: Chưa đăng nhập hoặc token sai
  ForbiddenException,    // 403: Không có quyền truy cập
  NotFoundException,     // 404: Không tìm thấy dữ liệu
  ConflictException,     // 409: Dữ liệu bị trùng lặp (ví dụ email đã tồn tại)
} from '@nestjs/common';

// Cách dùng trong Service:
if (!user) {
  throw new NotFoundException('Người dùng không tồn tại');
}

if (user.isBlocked) {
  throw new ForbiddenException('Tài khoản của bạn đã bị khóa');
}
```
Client sẽ tự động nhận về đúng format JSON:
```json
{
  "statusCode": 404,
  "message": "Người dùng không tồn tại",
  "error": "Not Found"
}
```

---

## 5. Streaming SSE (Token-by-Token Cho AI Chat)

Đây là chức năng quan trọng nhất cho dự án Chatbot của bạn.

### Mẫu chuẩn làm Streaming với Express Response (`res`)
Trong `chat.service.ts`:
```typescript
import { Response } from 'express';

async function streamChatToClient(res: Response, prompt: string) {
  // 1. Luôn mở đầu bằng các header này:
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // 2. Bắn sự kiện bắt đầu:
  res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

  // 3. Mỗi khi có từ mới từ AI:
  // Định dạng bắt buộc của SSE: bắt đầu bằng "data: ", kết thúc bằng 2 dấu xuống dòng "\n\n"
  res.write(`data: ${JSON.stringify({ type: 'delta', text: 'Xin ' })}\n\n`);
  res.write(`data: ${JSON.stringify({ type: 'delta', text: 'chào!' })}\n\n`);

  // 4. Khi AI nói xong:
  res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
  res.end(); // Đóng kết nối
}
```

### Ở Frontend (Next.js) đọc stream này như thế nào?
```typescript
const response = await fetch('http://localhost:3001/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: 'Xin chào' }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Xử lý từng dòng "data: { ... }"
  console.log('Token nhận về:', chunk);
}
```

---

## 6. Lệnh Tự Sinh Code (Nest CLI - Dành Cho Người Lười Gõ Tay)

Thay vì tạo tay từng file, bạn mở terminal tại thư mục `api/` và gõ:

```bash
# Tạo cả cụm Module + Controller + Service tên là "agents" chỉ với 3 lệnh:
npx nest g module agents
npx nest g controller agents
npx nest g service agents
```
Nest CLI sẽ tự động tạo thư mục `src/agents/`, sinh sẵn file mẫu và tự đăng ký vào `app.module.ts` cho bạn.

---

## 7. Ba Lỗi Người Mới 99% Sẽ Gặp & Cách Sửa

### Lỗi 1: `Nest can't resolve dependencies of the ...`
- **Nguyên nhân**: Bạn dùng `constructor(private myService: MyService)` trong Controller, nhưng quên khai báo `MyService` vào mục `providers: [MyService]` trong Module tương ứng.
- **Cách sửa**: Mở file `.module.ts`, kiểm tra mảng `providers` đã có `MyService` chưa.

### Lỗi 2: Gửi sai dữ liệu mà API vẫn nhận (hoặc không báo lỗi)
- **Nguyên nhân**: Quên gắn decorator validate như `@IsString()`, `@IsNotEmpty()` vào biến trong class DTO.
- **Cách sửa**: Bất kỳ biến nào trong file DTO đều phải có ít nhất 1 decorator của `class-validator`.

### Lỗi 3: Frontend bị lỗi đỏ `CORS error`
- **Nguyên nhân**: Port của Frontend chưa được cấp phép trong `main.ts`.
- **Cách sửa**: Mở `src/main.ts`, tìm đoạn `app.enableCors` và thêm domain/port của Frontend vào mảng `origin: ['http://localhost:3000']`.
