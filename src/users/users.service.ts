import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './users.model';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private usernameIndex = new Set();

  async createUser(username: string, password: string): Promise<User> {
    if (this.usernameIndex.has(username)) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: Date.now(),
      username,
      password: hashedPassword,
      lastLoggedIn: Date.now(),
    };
    this.users.push(newUser);
    this.usernameIndex.add(username);
    return newUser;
  }

  async findUser(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.findUser(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }
}
