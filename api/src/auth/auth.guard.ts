import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { jwtVerify } from 'jose';

export interface AuthenticatedUser {
  email: string;
  name?: string;
  sub?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Guard xác thực toàn cục — kiểm tra Bearer token (JWT HS256)
 * do Frontend phát hành bằng chung `AUTH_SECRET`.
 *
 * Exempt (bỏ qua guard): GET /api/health
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // Bỏ qua xác thực cho health check
    if (req.path === '/api/health') {
      return true;
    }

    const token = this.extractBearerToken(req);
    if (!token) {
      throw new UnauthorizedException('Thiếu Authorization header');
    }

    const secret = this.config.get<string>('AUTH_SECRET');
    if (!secret) {
      throw new UnauthorizedException('AUTH_SECRET chưa được cấu hình trên server');
    }

    try {
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(token, secretKey);

      const allowedEmail = this.config.get<string>('ALLOWED_EMAIL');
      if (allowedEmail && payload.email !== allowedEmail) {
        throw new UnauthorizedException('Email không có quyền truy cập');
      }

      req.user = {
        email: payload.email as string,
        name: payload.name as string | undefined,
        sub: payload.sub,
      };

      return true;
    } catch (err: unknown) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  private extractBearerToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.slice(7).trim();
  }
}
