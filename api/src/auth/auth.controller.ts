import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @Get('me')
  getMe(@Req() req: Request) {
    return {
      authenticated: true,
      user: req.user,
    };
  }
}
