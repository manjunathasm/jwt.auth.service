import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppLogger, CommonModule } from './common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CommonModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, AppLogger],
})
export class AppModule {}
