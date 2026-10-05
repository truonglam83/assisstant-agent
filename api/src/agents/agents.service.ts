import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { AgentRule } from './entities/agent-rule.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>,
    @InjectRepository(AgentRule)
    private readonly ruleRepo: Repository<AgentRule>,
  ) {}

  async findAll(): Promise<Agent[]> {
    return this.agentRepo.find({
      order: {
        sortOrder: 'ASC',
        createdAt: 'ASC',
      },
      relations: { rules: true },
    });
  }

  async findBySlug(slug: string): Promise<Agent> {
    const agent = await this.agentRepo.findOne({
      where: { slug },
      relations: { rules: true },
    });

    if (!agent) {
      throw new NotFoundException(`Không tìm thấy agent với slug: "${slug}"`);
    }

    return agent;
  }

  async findById(id: string): Promise<Agent> {
    const agent = await this.agentRepo.findOne({
      where: { id },
      relations: { rules: true },
    });

    if (!agent) {
      throw new NotFoundException(`Không tìm thấy agent với ID: "${id}"`);
    }

    return agent;
  }

  async create(dto: CreateAgentDto): Promise<Agent> {
    const existing = await this.agentRepo.findOne({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Agent với slug "${dto.slug}" đã tồn tại`);
    }

    const agent = this.agentRepo.create({
      slug: dto.slug,
      name: dto.name,
      description: dto.description || '',
      instructions: dto.instructions || '',
      tools: dto.tools || [],
      skills: dto.skills || [],
      model: dto.model || 'claude-3-5-sonnet-latest',
      icon: dto.icon,
      color: dto.color,
      enabled: dto.enabled ?? true,
    });

    return this.agentRepo.save(agent);
  }

  async update(id: string, dto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findById(id);

    if (dto.slug && dto.slug !== agent.slug) {
      const conflict = await this.agentRepo.findOne({
        where: { slug: dto.slug },
      });
      if (conflict) {
        throw new ConflictException(`Agent với slug "${dto.slug}" đã tồn tại`);
      }
    }

    Object.assign(agent, dto);
    return this.agentRepo.save(agent);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const agent = await this.findById(id);

    if (agent.slug === 'general' || agent.isDefault) {
      throw new BadRequestException('Không thể xóa agent mặc định (Chat chung)');
    }

    await this.agentRepo.softDelete(id);
    return {
      success: true,
      message: `Đã xóa agent "${agent.name}" thành công`,
    };
  }
}
