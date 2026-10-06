import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Controller()
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get('agents/:agentId/rules')
  getRulesByAgent(@Param('agentId') agentId: string) {
    return this.rulesService.findByAgent(agentId);
  }

  @Post('agents/:agentId/rules')
  createRule(
    @Param('agentId') agentId: string,
    @Body() dto: CreateRuleDto,
  ) {
    return this.rulesService.create(agentId, dto);
  }

  @Patch('rules/:id')
  updateRule(@Param('id') id: string, @Body() dto: UpdateRuleDto) {
    return this.rulesService.update(id, dto);
  }

  @Delete('rules/:id')
  deleteRule(@Param('id') id: string) {
    return this.rulesService.remove(id);
  }

  @Get('rules/:id/versions')
  getRuleVersions(@Param('id') id: string) {
    return this.rulesService.findVersions(id);
  }
}
