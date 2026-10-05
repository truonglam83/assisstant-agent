import { Body, Controller, Get, MessageEvent, Post, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * 1. GET /api/chat/stream
   * Stream bằng Decorator @Sse native của NestJS (trả về Observable)
   */
  @Sse('stream')
  sseStream(): Observable<MessageEvent> {
    return this.chatService.getDemoStream();
  }

  /**
   * 2. POST /api/chat/stream
   * Stream bằng HTTP POST gửi body (Pattern chuẩn của AI Chat Assistant)
   */
  @Post('stream')
  async postStream(
    @Body() dto: SendMessageDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.chatService.streamPostResponse(dto, res);
  }

  /**
   * 3. POST /api/chat/message
   * Endpoint REST truyền thống không stream
   */
  @Post('message')
  directMessage(@Body() dto: SendMessageDto) {
    return this.chatService.processDirectMessage(dto);
  }
}
