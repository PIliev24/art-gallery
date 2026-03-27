-- Step 1: Add new columns (nullable initially)
ALTER TABLE "artworks" ADD COLUMN "artist_name" text;
--> statement-breakpoint
ALTER TABLE "exhibitions" ADD COLUMN "artist_names" text;
--> statement-breakpoint

-- Step 2: Migrate data from existing tables
UPDATE "artworks" SET "artist_name" = "artists"."name" FROM "artists" WHERE "artworks"."artist_id" = "artists"."id";
--> statement-breakpoint
UPDATE "exhibitions" SET "artist_names" = (
  SELECT json_agg(a."name")::text FROM "exhibition_artists" ea
  JOIN "artists" a ON ea."artist_id" = a."id"
  WHERE ea."exhibition_id" = "exhibitions"."id"
);
--> statement-breakpoint

-- Step 3: Make artist_name NOT NULL after data population
ALTER TABLE "artworks" ALTER COLUMN "artist_name" SET NOT NULL;
--> statement-breakpoint

-- Step 4: Drop foreign key constraints
ALTER TABLE "artworks" DROP CONSTRAINT "artworks_artist_id_artists_id_fk";
--> statement-breakpoint
ALTER TABLE "exhibition_artists" DROP CONSTRAINT "exhibition_artists_exhibition_id_exhibitions_id_fk";
--> statement-breakpoint
ALTER TABLE "exhibition_artists" DROP CONSTRAINT "exhibition_artists_artist_id_artists_id_fk";
--> statement-breakpoint

-- Step 5: Drop old columns and tables
ALTER TABLE "artworks" DROP COLUMN "artist_id";
--> statement-breakpoint
DROP TABLE "exhibition_artists";
--> statement-breakpoint
DROP TABLE "artists";
