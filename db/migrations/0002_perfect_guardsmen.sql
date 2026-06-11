CREATE TABLE IF NOT EXISTS "request_rate_limits" (
	"bucket_key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"reset_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_public_feed_idx" ON "articles" USING btree ("status","deleted_at","published_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_author_idx" ON "articles" USING btree ("author_id","deleted_at","updated_at");
