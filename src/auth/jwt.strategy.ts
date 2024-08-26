import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          try {
            if (!req.jwt && req.headers?.authorization) {
              req.jwt = req.headers.authorization;
            }
            return req.jwt.replace(/^Bearer\s/, '');
          } catch (e) {
            return null;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'replacemesecret',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUserByJwtToken(
      payload.username,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
