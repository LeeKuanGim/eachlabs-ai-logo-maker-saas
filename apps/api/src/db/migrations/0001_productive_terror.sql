CREATE TYPE "public"."credit_transaction_type" AS ENUM('signup_bonus', 'purchase', 'usage', 'refund', 'adjustment_add', 'adjustment_remove');--> statement-breakpoint
CREATE TABLE "credit_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"credits" integer NOT NULL,
	"price_in_cents" integer NOT NULL,
	"polar_product_id" varchar(256),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "credit_transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"description" text,
	"polar_order_id" varchar(256),
	"polar_product_id" varchar(256),
	"logo_generation_id" uuid,
	"performed_by" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credit_balances" (
	"user_id" text PRIMARY KEY NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"total_purchased" integer DEFAULT 0 NOT NULL,
	"total_used" integer DEFAULT 0 NOT NULL,
	"last_transaction_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "logo_generations" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "logo_generations" ADD COLUMN "credits_charged" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE INDEX "credit_packages_polar_product_id_idx" ON "credit_packages" USING btree ("polar_product_id");--> statement-breakpoint
CREATE INDEX "credit_packages_active_order_idx" ON "credit_packages" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "credit_transactions_user_id_created_at_idx" ON "credit_transactions" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "credit_transactions_user_id_idx" ON "credit_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "credit_transactions_type_created_at_idx" ON "credit_transactions" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "credit_transactions_polar_order_id_idx" ON "credit_transactions" USING btree ("polar_order_id");--> statement-breakpoint
CREATE INDEX "credit_transactions_logo_generation_id_idx" ON "credit_transactions" USING btree ("logo_generation_id");--> statement-breakpoint
CREATE INDEX "logo_generations_created_at_idx" ON "logo_generations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "logo_generations_status_idx" ON "logo_generations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "logo_generations_provider_prediction_id_idx" ON "logo_generations" USING btree ("provider_prediction_id");--> statement-breakpoint
CREATE INDEX "logo_generations_user_id_created_at_idx" ON "logo_generations" USING btree ("user_id","created_at" DESC NULLS LAST);