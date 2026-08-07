CREATE INDEX IF NOT EXISTS "user_id_idx" ON "files" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parent_id_idx" ON "files" ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_trash_idx" ON "files" ("is_trash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_starred_idx" ON "files" ("is_starred");