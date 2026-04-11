import { Module } from '@nestjs/common';
import { MyLoggerService } from './my-logger/my-logger.service';

@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService], // 🔥 VERY IMPORTANT
})
export class LoggerModule {}
