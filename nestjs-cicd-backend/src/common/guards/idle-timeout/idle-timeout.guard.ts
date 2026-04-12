import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { db } from '../../../database/db';
import { users } from '../../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class IdleTimeoutGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    // 🔥 Fetch latest user data
    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));

    if (!dbUser) {
      throw new UnauthorizedException('User not found');
    }

    //const lastActivity = new Date(dbUser.lastActivity);
    const lastActivity = dbUser.lastActivity ? new Date(dbUser.lastActivity) : new Date(); // fallback (treat as active)

    const now = new Date();

    console.log('LAST ACTIVITY:', dbUser.lastActivity);
    console.log('NOW:', new Date());

    const diffSeconds = (now.getTime() - lastActivity.getTime()) / 1000;

    console.log('DIFF SECONDS:', diffSeconds);

    const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
    console.log(diffMinutes);

    // ⏳ 30 minutes idle timeout
    //if (diffMinutes > 30) {
    //if (diffMinutes > 0.1) {  // ~6 seconds for testing
    if (diffSeconds > 300) {
      // ✅ 10 seconds
      //if (diffSeconds > 10) { // 5 minutes
      throw new UnauthorizedException('Session expired due to inactivity');
    }

    return true;
  }
}
/*
🎯 EXACT BEHAVIOR (STEP-BY-STEP)
🧪 Scenario
User logs in
   ↓
User calls /users → ✅ allowed
   ↓
lastActivity updated
   ↓
User does NOTHING for 20 sec
   ↓
(No request happens here ❗)
   ↓
User calls /users again
   ↓
IdleTimeoutGuard runs
   ↓
diffSeconds > 15 ❌
   ↓
401 Session expired
------------------
🎯 FULL FLOW
Request comes
   ↓
JwtGuard (auth)
   ↓
IdleTimeoutGuard
   ↓
Check lastActivity
   ↓
If idle > 15 sec → ❌ reject
   ↓
Else → ✅ allow
   ↓
Controller runs
   ↓
Activity updated
*/
