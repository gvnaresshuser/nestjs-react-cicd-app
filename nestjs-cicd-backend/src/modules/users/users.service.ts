import { Injectable } from '@nestjs/common';
import { db } from '../../database/db';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(private authService: AuthService) {}

  /* async create(data: any) {
        return db.insert(users).values(data).returning();
    } */
  async create(data: any) {
    console.log('Incoming Data:', data);
    const hashedPassword = await this.authService.hashPassword(data.password);

    try {
      /* const result = await db.insert(users).values({
                email: data.email,
                password: data.password,
                role: data.role || 'USER',
            }).returning(); */
      const result = await db
        .insert(users)
        .values({
          email: data.email,
          password: hashedPassword, // ✅ FIX
          role: data.role || 'USER',
        })
        .returning();

      console.log('Insert Result:', result);
      return result;
    } catch (error: any) {
      console.log('🔥 FULL DB ERROR:', error); // full object
      console.log('🔥 ERROR MESSAGE:', error?.message); // message
      console.log('🔥 ERROR DETAIL:', error?.detail); // postgres detail
      console.log('🔥 ERROR CODE:', error?.code); // postgres code

      throw new Error(error?.message || 'DB Insert Failed');
    }
  }

  async findAll(limit = 10, offset = 0) {
    return db.select().from(users).limit(limit).offset(offset);
  }

  async findOne(id: number) {
    return db.select().from(users).where(eq(users.id, id));
  }

  async update(id: number, data: any) {
    return db.update(users).set(data).where(eq(users.id, id)).returning();
  }

  async delete(id: number) {
    return db.delete(users).where(eq(users.id, id));
  }

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return user;
  }
}
