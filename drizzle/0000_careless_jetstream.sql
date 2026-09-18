CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"referred_by" text,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email"),
	CONSTRAINT "waitlist_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE INDEX "waitlist_referred_by_idx" ON "waitlist" USING btree ("referred_by");