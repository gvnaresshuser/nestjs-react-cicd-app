import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { db } from '../../../database/db';
import { users } from '../../../database/schema';
import { eq } from 'drizzle-orm';

type JwtPayload = {
  id: number;
  email: string;
  role: string;
};

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    /* const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(' ')[1]; */

    //Change priority to Authorization header first
    //const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
    const token = req.cookies?.accessToken;

    console.log('TOKEN USED FROM REQ COOKIES...!!!:', token);

    // ❌ NO TOKEN
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      /* const decoded: any = jwt.verify(
        token,
        this.config.get<string>('jwt.secret')!,
      ); */
      const decoded = jwt.verify(token, this.config.get<string>('jwt.secret')!) as JwtPayload;

      console.log('Decoded:', decoded);

      // 🔥 NEW: Validate user from DB
      const [user] = await db.select().from(users).where(eq(users.id, decoded.id));

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      // ✅ Attach FULL USER (not just token payload)
      req.user = user;
      req.token = token;

      return true;
    } catch (err: any) {
      console.log('ERROR OBJECT:', err);
      //throw new UnauthorizedException('Invalid or expired token');
      if (err.name === 'TokenExpiredError') {
        //throw new UnauthorizedException('Token expired - NEW TEST');
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
/*
🧠 Request Lifecycle
Request
  ↓
ActivityMiddleware (updates lastActivity)
  ↓
JwtGuard (this file)
   ✔ verifies token
   ✔ fetches user from DB
   ✔ attaches req.user
  ↓
IdleTimeoutGuard
   ✔ checks lastActivity
   ✔ throws if > 30 mins
  ↓
Controller
*/
