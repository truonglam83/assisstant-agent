import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../agents/entities/agent.entity';
import { AgentRule } from '../agents/entities/agent-rule.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>,
    @InjectRepository(AgentRule)
    private readonly ruleRepo: Repository<AgentRule>,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.seedDefaults();
    } catch (error) {
      this.logger.warn(`Chưa thể seed dữ liệu (PostgreSQL có thể chưa chạy): ${(error as Error).message}`);
    }
  }

  async seedDefaults() {
    const count = await this.agentRepo.count();
    if (count > 0) {
      this.logger.log('Database đã có dữ liệu agent, bỏ qua bước seed.');
      return;
    }

    this.logger.log('Bắt đầu khởi tạo dữ liệu mẫu (Seed)...');

    // 1. Tạo Agent "Chat chung" (general)
    const generalAgent = this.agentRepo.create({
      slug: 'general',
      name: 'Chat chung',
      description: 'Trợ lý AI đa năng, giải đáp thắc mắc và điều phối tác vụ',
      instructions: 'Bạn là trợ lý cá nhân thông minh. Hỗ trợ người dùng trả lời câu hỏi và định hướng sử dụng các agent chuyên trách khi cần.',
      capabilities: {
        can: ['Hỏi đáp mọi chủ đề', 'Gợi ý chuyển sang Agent chuyên biệt'],
        cannot: ['Thao tác trực tiếp với hòm thư cá nhân khi chưa kết nối tool'],
      },
      tools: [],
      skills: [],
      isDefault: true,
      enabled: true,
      sortOrder: 0,
    });
    const savedGeneral = await this.agentRepo.save(generalAgent);

    await this.ruleRepo.save(
      this.ruleRepo.create({
        agentId: savedGeneral.id,
        scope: 'all',
        title: 'Quy tắc ứng xử',
        content: 'Luôn trả lời ngắn gọn, súc tích và xưng hô thân thiện.',
        enabled: true,
        version: 1,
      }),
    );

    // 2. Tạo Agent "Mail & Action" (mail-action)
    const mailAgent = this.agentRepo.create({
      slug: 'mail-action',
      name: 'Mail & Action',
      description: 'Đọc, soạn thảo, tóm tắt email và thực hiện tác vụ tự động',
      instructions: 'Bạn chuyên trách xử lý công việc liên quan đến hòm thư Gmail, tổng hợp báo cáo và hỗ trợ gửi mail.',
      capabilities: {
        can: ['Đọc hộp thư đến', 'Soạn email nháp', 'Tạo báo cáo ngày'],
        cannot: ['Gửi email ra ngoài nếu chưa được chủ nhân duyệt qua thẻ xác nhận'],
      },
      tools: ['read_gmail', 'send_email', 'search_emails'],
      skills: ['daily-report'],
      isDefault: false,
      enabled: true,
      sortOrder: 1,
    });
    const savedMail = await this.agentRepo.save(mailAgent);

    await this.ruleRepo.save([
      this.ruleRepo.create({
        agentId: savedMail.id,
        scope: 'all',
        title: 'Chữ ký email',
        content: 'Cuối mỗi email phải luôn có chữ ký: "Trân trọng,\\nLâm."',
        enabled: true,
        version: 1,
      }),
      this.ruleRepo.create({
        agentId: savedMail.id,
        scope: 'daily-report',
        title: 'Cấu trúc Báo cáo ngày',
        content: 'Báo cáo phải chia rõ 3 phần: [1] Việc đã hoàn tất hôm nay, [2] Việc phát sinh cần lưu ý, [3] Kế hoạch ngày mai.',
        enabled: true,
        version: 1,
      }),
    ]);

    this.logger.log('Khởi tạo dữ liệu mẫu hoàn tất thành công!');
  }
}
