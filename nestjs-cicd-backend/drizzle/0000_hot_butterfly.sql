CREATE TABLE "nestjs_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"password" text,
	"role" text NOT NULL
);
