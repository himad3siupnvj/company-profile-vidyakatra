ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "claimed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "phone";
