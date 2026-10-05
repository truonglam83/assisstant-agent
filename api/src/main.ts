import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Cấu hình Global Prefix: mọi endpoint đều bắt đầu bằng /api/...
  app.setGlobalPrefix('api');

  // 2. Cấu hình CORS cho Next.js Frontend
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 3. Cấu hình ValidationPipe toàn cục với class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field thừa không khai báo trong DTO
      transform: true, // Tự động convert kiểu dữ liệu theo DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu client truyền field lạ
    }),
  );

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);

  logger.log(`🚀 NestJS API Server đang chạy tại: http://localhost:${port}/api`);
  logger.log(`📡 Health check: http://localhost:${port}/api/health`);
  logger.log(`💬 Chat stream GET: http://localhost:${port}/api/chat/stream`);
  logger.log(`💬 Chat stream POST: http://localhost:${port}/api/chat/stream`);
}

void bootstrap();
