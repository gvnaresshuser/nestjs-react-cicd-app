import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { db } from '../../../database/db';
import { users } from '../../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ActivityMiddleware implements NestMiddleware {
  constructor(private config: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

      if (token) {
        const decoded: any = jwt.verify(token, this.config.get<string>('jwt.secret')!);

        if (decoded?.id) {
          await db.update(users).set({ lastActivity: new Date() }).where(eq(users.id, decoded.id));
        }
      }
    } catch (err) {
      console.log(err);
      // silently ignore (token may be invalid)
    }

    next();
  }
}
//----------------------------------------------------------
/* import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ActivityMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
 */
