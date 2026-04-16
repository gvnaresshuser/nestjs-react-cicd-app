import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { MyLoggerService } from './common/logger/my-logger/my-logger.service';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

import { ConfigModule } from '@nestjs/config'; // ✅ ADD
import configuration from './config/configuration'; // ✅ ADD
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; //pnpm add @nestjs/throttler
import { APP_GUARD } from '@nestjs/core';

//import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
//import { NestModule } from '@nestjs/common';
//import { ActivityMiddleware } from './common/middleware/activity/activity.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // ✅ ensures env is loaded
      load: [configuration],
    }),

    UsersModule,
    AuthModule,
    MailModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // ✅ FIX
    },
    MyLoggerService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    //consumer.apply(LoggerMiddleware, ActivityMiddleware).forRoutes('*');; // ✅ ADD HERE
  }
}
/*
THROTTLE:
--------
named configs
🔥 2. What is this config?
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,
    limit: 3,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 100,
  }
])

👉 You created two rate-limit profiles

| Name  | Meaning                   |
| ----- | ------------------------- |
| short | 3 requests per 1 second   |
| long  | 100 requests per 1 minute |
-----------------------------------------
Without it:

❌ @Throttle() will NOT work
❌ Throttling won’t run automatically
------------------------------------
❓ Do we need APP_GUARD?
👉 ✅ YES (for global throttling)
*/
/*
⚠️ WHY THIS ORDER MATTERS
.apply(LoggerMiddleware, ActivityMiddleware)

Execution order:

LoggerMiddleware
ActivityMiddleware
Guards (JwtGuard, IdleTimeoutGuard)
*/
/*
🔥 FINAL ARCHITECTURE (CLEAN)
Request
  ↓
LoggerMiddleware
  ↓
ActivityMiddleware  (updates lastActivity)
  ↓
JwtGuard            (validates token + loads user)
  ↓
IdleTimeoutGuard    (checks inactivity)
  ↓
Controller
*/
//--------------------------------------------------------

/* import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [UsersModule, AuthModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
*/
