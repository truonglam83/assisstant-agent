import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, interval, map, take } from 'rxjs';
import { Response } from 'express';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  /**
   * SSE Stream qua RxJS Observable (chuẩn của NestJS decorator @Sse)
   */
  getDemoStream(): Observable<MessageEvent> {
    const mockChunks = [
      'Xin chào! ',
      'Tôi là trợ lý AI ',
      'chạy trên nền tảng NestJS. ',
      'Hệ thống streaming SSE ',
      'đang hoạt động hoàn hảo!',
    ];

    return interval(300).pipe(
      take(mockChunks.length),
      map((index) => ({
        data: {
          type: 'delta',
          text: mockChunks[index],
          index,
        },
      })),
    );
  }

  /**
   * SSE Stream cho HTTP POST (phương thức phổ biến nhất khi gọi Chat AI)
   * Sử dụng trực tiếp đối tượng Express Response để flush từng token về client.
   */
  async streamPostResponse(dto: SendMessageDto, res: Response): Promise<void> {
    // 1. Thiết lập Header chuẩn Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Hỗ trợ tắt buffer của Nginx reverse-proxy
    res.flushHeaders?.();

    const conversationId = dto.conversationId || `conv-${Date.now()}`;
    const agentName = dto.agentSlug ? `[Agent: ${dto.agentSlug}]` : '[Chat chung]';

    // 2. Gửi sự kiện bắt đầu (start event)
    res.write(
      `data: ${JSON.stringify({
        type: 'start',
        conversationId,
        agent: agentName,
        timestamp: new Date().toISOString(),
      })}\n\n`,
    );

    // 3. Giả lập streaming từng token từ LLM (Claude / OpenAI)
    const simulatedWords = [
      'Chào bạn! ',
      'Tôi đã nhận được nội dung: ',
      `"${dto.content}". `,
      `Hiện tại ${agentName} đang xử lý qua NestJS Streaming API. `,
      'SSE hoạt động rất mượt mà và tiết kiệm tài nguyên!',
    ];

    for (const word of simulatedWords) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      res.write(
        `data: ${JSON.stringify({
          type: 'delta',
          text: word,
        })}\n\n`,
      );
    }

    // 4. Gửi sự kiện kết thúc (done event) kèm metadata
    await new Promise((resolve) => setTimeout(resolve, 150));
    res.write(
      `data: ${JSON.stringify({
        type: 'done',
        finishReason: 'stop',
        usage: {
          promptTokens: 25,
          completionTokens: 42,
          totalTokens: 67,
        },
      })}\n\n`,
    );

    // 5. Đóng kết nối stream
    res.end();
  }

  /**
   * Phương thức trả lời dạng REST truyền thống (không stream)
   */
  processDirectMessage(dto: SendMessageDto) {
    return {
      success: true,
      data: {
        content: `NestJS đã nhận được: "${dto.content}"`,
        agentSlug: dto.agentSlug || null,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
