import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { AgentRule } from './entities/agent-rule.entity';
import { AgentRuleVersion } from './entities/agent-rule-version.entity';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, AgentRule, AgentRuleVersion])],
  controllers: [AgentsController, RulesController],
  providers: [AgentsService, RulesService],
  exports: [AgentsService, RulesService],
})
export class AgentsModule {}
