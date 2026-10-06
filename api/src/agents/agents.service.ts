import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AgentResponse = Agent & {
  canDo: string[];
  cannotDo: string[];
};

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>,
  ) {}

  private toResponse(agent: Agent): AgentResponse {
    return {
      ...agent,
      canDo: agent.capabilities?.can ?? [],
      cannotDo: agent.capabilities?.cannot ?? [],
    };
  }

  async findAll(): Promise<AgentResponse[]> {
    const agents = await this.agentRepo.find({
      order: {
        sortOrder: 'ASC',
        createdAt: 'ASC',
      },
      relations: { rules: true },
    });
    return agents.map((agent) => this.toResponse(agent));
  }

  async findByIdOrSlug(idOrSlug: string): Promise<AgentResponse> {
    const isUuid = UUID_REGEX.test(idOrSlug);
    const agent = await this.agentRepo.findOne({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      relations: { rules: true },
    });

    if (!agent) {
      throw new NotFoundException(`Không tìm thấy agent: "${idOrSlug}"`);
    }

    return this.toResponse(agent);
  }

  async findBySlug(slug: string): Promise<AgentResponse> {
    return this.findByIdOrSlug(slug);
  }

  async findById(id: string): Promise<AgentResponse> {
    return this.findByIdOrSlug(id);
  }

  async create(dto: CreateAgentDto): Promise<AgentResponse> {
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
      capabilities: {
        can: dto.canDo ?? [],
        cannot: dto.cannotDo ?? [],
      },
      tools: dto.tools || [],
      skills: dto.skills || [],
      model: dto.model || 'claude-3-5-sonnet-latest',
      icon: dto.icon,
      color: dto.color,
      enabled: dto.enabled ?? true,
    });

    const saved = await this.agentRepo.save(agent);
    return this.toResponse(saved);
  }

  async update(idOrSlug: string, dto: UpdateAgentDto): Promise<AgentResponse> {
    const isUuid = UUID_REGEX.test(idOrSlug);
    const agent = await this.agentRepo.findOne({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
    });

    if (!agent) {
      throw new NotFoundException(`Không tìm thấy agent: "${idOrSlug}"`);
    }

    if (dto.slug && dto.slug !== agent.slug) {
      const conflict = await this.agentRepo.findOne({
        where: { slug: dto.slug },
      });
      if (conflict) {
        throw new ConflictException(`Agent với slug "${dto.slug}" đã tồn tại`);
      }
      agent.slug = dto.slug;
    }

    if (dto.name !== undefined) agent.name = dto.name;
    if (dto.description !== undefined) agent.description = dto.description;
    if (dto.instructions !== undefined) agent.instructions = dto.instructions;
    if (dto.tools !== undefined) agent.tools = dto.tools;
    if (dto.skills !== undefined) agent.skills = dto.skills;
    if (dto.model !== undefined) agent.model = dto.model;
    if (dto.icon !== undefined) agent.icon = dto.icon;
    if (dto.color !== undefined) agent.color = dto.color;
    if (dto.enabled !== undefined) agent.enabled = dto.enabled;

    if (dto.canDo !== undefined || dto.cannotDo !== undefined) {
      agent.capabilities = {
        can: dto.canDo ?? agent.capabilities?.can ?? [],
        cannot: dto.cannotDo ?? agent.capabilities?.cannot ?? [],
      };
    }

    const saved = await this.agentRepo.save(agent);
    return this.toResponse(saved);
  }

  async remove(idOrSlug: string): Promise<{ success: boolean; message: string }> {
    const isUuid = UUID_REGEX.test(idOrSlug);
    const agent = await this.agentRepo.findOne({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
    });

    if (!agent) {
      throw new NotFoundException(`Không tìm thấy agent: "${idOrSlug}"`);
    }

    if (agent.slug === 'general' || agent.isDefault) {
      throw new BadRequestException('Không thể xóa agent mặc định (Chat chung)');
    }

    await this.agentRepo.softDelete(agent.id);
    return {
      success: true,
      message: `Đã xóa agent "${agent.name}" thành công`,
    };
  }
}
