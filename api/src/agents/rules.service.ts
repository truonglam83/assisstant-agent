import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentRule } from './entities/agent-rule.entity';
import { AgentRuleVersion } from './entities/agent-rule-version.entity';
import { AgentsService } from './agents.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(AgentRule)
    private readonly ruleRepo: Repository<AgentRule>,
    @InjectRepository(AgentRuleVersion)
    private readonly versionRepo: Repository<AgentRuleVersion>,
    private readonly agentsService: AgentsService,
  ) {}

  async findByAgent(agentIdOrSlug: string): Promise<AgentRule[]> {
    const agent = await this.agentsService.findByIdOrSlug(agentIdOrSlug);
    return this.ruleRepo.find({
      where: { agentId: agent.id },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<AgentRule> {
    const rule = await this.ruleRepo.findOne({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException(`Không tìm thấy rule với ID: "${id}"`);
    }

    return rule;
  }

  async create(
    agentIdOrSlug: string,
    dto: CreateRuleDto,
  ): Promise<AgentRule> {
    const agent = await this.agentsService.findByIdOrSlug(agentIdOrSlug);

    const rule = this.ruleRepo.create({
      agentId: agent.id,
      scope: dto.scope || 'all',
      title: dto.title,
      content: dto.content,
      enabled: dto.enabled ?? true,
      version: 1,
    });

    const savedRule = await this.ruleRepo.save(rule);

    // Tạo snapshot phiên bản đầu tiên (version 1)
    const initialVersion = this.versionRepo.create({
      ruleId: savedRule.id,
      version: 1,
      content: savedRule.content,
      changeReason: 'Khởi tạo rule ban đầu',
    });
    await this.versionRepo.save(initialVersion);

    return savedRule;
  }

  async update(id: string, dto: UpdateRuleDto): Promise<AgentRule> {
    const rule = await this.findById(id);

    // RÀNG BUỘC NGHIỆP VỤ: Nếu muốn tắt rule (enabled: false), kiểm tra xem có phải rule cuối cùng đang bật
    if (dto.enabled === false && rule.enabled === true) {
      const activeRulesCount = await this.ruleRepo.count({
        where: { agentId: rule.agentId, enabled: true },
      });

      if (activeRulesCount <= 1) {
        throw new BadRequestException(
          'Mỗi agent phải có ít nhất 1 rule đang hoạt động. Không thể tắt rule hoạt động cuối cùng.',
        );
      }
      rule.enabled = false;
    } else if (dto.enabled === true) {
      rule.enabled = true;
    }

    if (dto.scope !== undefined) rule.scope = dto.scope;
    if (dto.title !== undefined) rule.title = dto.title;

    // Nếu content thay đổi -> Tự động tăng version và lưu snapshot vào agent_rule_versions
    if (dto.content !== undefined && dto.content !== rule.content) {
      rule.version += 1;
      rule.content = dto.content;

      const newVersionSnapshot = this.versionRepo.create({
        ruleId: rule.id,
        version: rule.version,
        content: rule.content,
        changeReason: dto.changeReason || 'Cập nhật nội dung',
      });
      await this.versionRepo.save(newVersionSnapshot);
    }

    return this.ruleRepo.save(rule);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const rule = await this.findById(id);

    // RÀNG BUỘC NGHIỆP VỤ: Không được xóa rule đang hoạt động cuối cùng của agent
    if (rule.enabled) {
      const activeRulesCount = await this.ruleRepo.count({
        where: { agentId: rule.agentId, enabled: true },
      });

      if (activeRulesCount <= 1) {
        throw new BadRequestException(
          'Mỗi agent phải có ít nhất 1 rule đang hoạt động. Không thể xóa rule hoạt động cuối cùng.',
        );
      }
    }

    await this.ruleRepo.softDelete(id);
    return {
      success: true,
      message: `Đã xóa rule "${rule.title}" thành công`,
    };
  }

  async findVersions(ruleId: string): Promise<AgentRuleVersion[]> {
    await this.findById(ruleId);

    return this.versionRepo.find({
      where: { ruleId },
      order: { version: 'DESC' },
    });
  }
}
