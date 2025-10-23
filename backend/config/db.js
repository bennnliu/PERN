import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const PGUSER = process.env.PGUSER || process.env.POSTGRES_USER;
const PGHOST = process.env.PGHOST || process.env.POSTGRES_HOST;
const PGDATABASE = process.env.PGDATABASE || process.env.POSTGRES_DB;
const PGPASSWORD = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;

if (!PGUSER || !PGHOST || !PGDATABASE || !PGPASSWORD) {
  throw new Error("Missing database configuration. Check your environment variables.");
}

const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

console.log("Initializing database connection...");

// Create SQL client
export const sql = neon(connectionString);

// Test the connection immediately
(async () => {
  try {
    const result = await sql`SELECT 1;`;
    console.log("✅ Database connection successful:", result);
    
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS houses (
        id SERIAL PRIMARY KEY,
        property_title VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        monthly_rent DECIMAL(10,2) NOT NULL,
        address VARCHAR(255) NOT NULL,
        property_type VARCHAR(255) NOT NULL,
        rooms INT NOT NULL,
        bathrooms INT NOT NULL,
        square_feet INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✅ Database tables verified");
  } catch (error) {
    console.error("🔥 Database connection error:", {
      message: error.message,
      stack: error.stack,
      details: error.details
    });
    // Don't exit the process, but make sure the error is very visible
    console.error("\n❌ DATABASE CONNECTION FAILED ❌\n");
  }
})();
