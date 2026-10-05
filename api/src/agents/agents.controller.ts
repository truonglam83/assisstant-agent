import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  getAllAgents() {
    return this.agentsService.findAll();
  }

  @Get(':slug')
  getAgentBySlug(@Param('slug') slug: string) {
    return this.agentsService.findBySlug(slug);
  }

  @Post()
  createAgent(@Body() dto: CreateAgentDto) {
    return this.agentsService.create(dto);
  }

  @Patch(':id')
  updateAgent(@Param('id') id: string, @Body() dto: UpdateAgentDto) {
    return this.agentsService.update(id, dto);
  }

  @Delete(':id')
  deleteAgent(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }
}
