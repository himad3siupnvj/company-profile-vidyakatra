CREATE TABLE "article_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"reason" varchar(40) NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_versions" ADD CONSTRAINT "article_versions_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_versions" ADD CONSTRAINT "article_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "article_versions_article_number_idx" ON "article_versions" USING btree ("article_id","version_number");--> statement-breakpoint
CREATE INDEX "article_versions_article_created_idx" ON "article_versions" USING btree ("article_id","created_at");
--> statement-breakpoint
UPDATE "articles"
SET "period_id" = (SELECT "id" FROM "periods" WHERE "status" = 'active' LIMIT 1)
WHERE "period_id" IS NULL
  AND EXISTS (SELECT 1 FROM "periods" WHERE "status" = 'active');
--> statement-breakpoint
UPDATE "organizational_units"
SET "period_id" = (SELECT "id" FROM "periods" WHERE "status" = 'active' LIMIT 1)
WHERE "period_id" IS NULL
  AND EXISTS (SELECT 1 FROM "periods" WHERE "status" = 'active');
--> statement-breakpoint
UPDATE "divisions"
SET "period_id" = (SELECT "id" FROM "periods" WHERE "status" = 'active' LIMIT 1)
WHERE "period_id" IS NULL
  AND EXISTS (SELECT 1 FROM "periods" WHERE "status" = 'active');
--> statement-breakpoint
UPDATE "members"
SET "period_id" = (SELECT "id" FROM "periods" WHERE "status" = 'active' LIMIT 1)
WHERE "period_id" IS NULL
  AND EXISTS (SELECT 1 FROM "periods" WHERE "status" = 'active');
--> statement-breakpoint
UPDATE "users"
SET "period_id" = (SELECT "id" FROM "periods" WHERE "status" = 'active' LIMIT 1)
WHERE "period_id" IS NULL
  AND EXISTS (SELECT 1 FROM "periods" WHERE "status" = 'active');
