import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Agent } from '../agents/entities/agent.entity';
import { AgentRule } from '../agents/entities/agent-rule.entity';
import { AgentRuleVersion } from '../agents/entities/agent-rule-version.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres_password'),
        database: config.get<string>('DB_NAME', 'assistant_db'),
        entities: [Agent, AgentRule, AgentRuleVersion],
        synchronize: true, // Tự động đồng bộ schema trong môi trường phát triển
        retryAttempts: 2,
        retryDelay: 2000,
        logging: ['error', 'warn'],
      }),
    }),
    TypeOrmModule.forFeature([Agent, AgentRule, AgentRuleVersion]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
