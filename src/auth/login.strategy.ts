import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import passport = require('passport');
import { AppLogger } from 'src/common';

class CustomStrategy extends passport.Strategy {}

@Injectable()
export class LoginStrategy extends PassportStrategy(CustomStrategy, 'login') {
  private readonly logger = new AppLogger(LoginStrategy.name, {
    timestamp: true,
  });

  constructor(private readonly authService: AuthService) {
    super();
  }

  async authenticate(req, options?: any): Promise<void> {
    const validation = this as any;
    const user = await this.authService.validateUser(
      req.body.username,
      req.body.password,
    );
    if (!user) {
      validation.error(new UnauthorizedException('Invalid credentials.'));
    } else {
      validation.success(user);
    }
  }
}
