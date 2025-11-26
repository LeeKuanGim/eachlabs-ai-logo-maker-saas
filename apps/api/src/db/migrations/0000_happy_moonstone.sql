CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TYPE "public"."generation_status" AS ENUM('queued', 'running', 'succeeded', 'failed');--> statement-breakpoint
CREATE TABLE "logo_generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_name" text NOT NULL,
	"app_focus" text NOT NULL,
	"color1" varchar(64) NOT NULL,
	"color2" varchar(64) NOT NULL,
	"model" varchar(64) NOT NULL,
	"output_count" integer DEFAULT 1 NOT NULL,
	"prompt" text NOT NULL,
	"status" "generation_status" DEFAULT 'queued' NOT NULL,
	"provider_prediction_id" varchar(128),
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"provider_response" jsonb,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
