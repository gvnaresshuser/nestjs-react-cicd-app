import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { db } from '../../../database/db';
import { users } from '../../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      /* tap(async () => {
        const user = req.user;

        if (user?.id) {
          await db
            .update(users)
            .set({ lastActivity: new Date() })
            .where(eq(users.id, user.id));
        }
      }), */
      //----------------------------------------
      tap(() => {
        const user = req.user;

        if (user?.id) {
          db.update(users)
            .set({ lastActivity: new Date() })
            .where(eq(users.id, user.id))
            .catch((err) => {
              console.error('Activity update failed:', err);
            });
        }
      }),
    );
  }
}
//--------------------------------------------------------------------------
/* import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}
 */
