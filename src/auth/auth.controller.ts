import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('login'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}
