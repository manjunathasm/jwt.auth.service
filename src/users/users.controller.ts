import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() body: { username: string; password: string },
  ): Promise<User> {
    return this.usersService.createUser(body.username, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
