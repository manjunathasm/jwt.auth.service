import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IUser } from 'src/users/users.model';

export interface JwtPayload {
  emailOrUserid: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    return await this.usersService.validateUser(username, password);
  }

  async validateUserByJwtToken(username: string): Promise<IUser> {
    return await this.usersService.findUser(username);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: any) {
    // handle the logout logic here
    // e.g., clear the session, remove the token from the client, etc.
    return true;
  }
}
