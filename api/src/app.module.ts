import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { ChatModule } from './chat/chat.module';
import { AgentsModule } from './agents/agents.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    ChatModule,
    AgentsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
