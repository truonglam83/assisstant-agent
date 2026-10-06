import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';

/**
 * AuthModule đăng ký AuthGuard global qua APP_GUARD token
 * và AuthController cung cấp GET /api/auth/me để kiểm tra trạng thái login.
 */
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
