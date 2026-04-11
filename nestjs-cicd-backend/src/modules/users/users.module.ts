import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config'; // ✅ ADD
import { LoggerModule } from '../../common/logger/logger.module';
import { AuthModule } from '../auth/auth.module'; // ✅ ADD

@Module({
  imports: [ConfigModule, LoggerModule, forwardRef(() => AuthModule)], // ✅ ADD THIS LINE
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
