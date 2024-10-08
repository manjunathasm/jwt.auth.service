import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LoginStrategy } from './login.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'replacemesecret',
      signOptions: { expiresIn: +(process.env.JWT_EXPIRY || 60 * 60) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LoginStrategy],
})
export class AuthModule {}
