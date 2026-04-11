import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const now = Date.now();

    return next.handle().pipe(tap(() => console.log(`Response time: ${Date.now() - now}ms`)));
  }
}
