/**
 * Database Migration Script
 *
 * This script applies Drizzle migrations to your Neon PostgreSQL database.
 * Run it with: npm run db:migrate
 */

import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

// Main migration function
async function runMigration() {
  console.log("🔄 Starting database migration...");

  try {
    // Create a Neon SQL connection
    const sql = neon(process.env.DATABASE_URL!);

    // Initialize Drizzle with the connection
    const db = drizzle(sql);

    // Run migrations from the drizzle folder
    console.log("📂 Running migrations from ./drizzle folder");
    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ Database migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
