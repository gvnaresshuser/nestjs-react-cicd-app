import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

//export const users = pgTable('users', {
export const users = pgTable('nestjs_users', {
  id: serial('id').primaryKey(),
  email: text('email'),
  //password: text('password'),
  password: text('password').notNull(),
  role: text('role').notNull(), // ✅ ADD THIS
  // ✅ ADD THIS
  //lastActivity: timestamp('last_activity').defaultNow(),
  lastActivity: timestamp('last_activity').defaultNow().notNull(),
});
