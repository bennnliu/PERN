import { sql } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

async function migrate() {
    console.log("🔄 Starting database migration...");
    
    try {
        // Step 1: Add new columns to users table
        console.log("Adding new columns to users table...");
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20)`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(10)`;
        
        // Update existing users to have a default user_type
        await sql`UPDATE users SET user_type = 'renter' WHERE user_type IS NULL`;
        
        // Make user_type NOT NULL after setting defaults
        await sql`ALTER TABLE users ALTER COLUMN user_type SET NOT NULL`;
        
        // Add check constraint
        await sql`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check`;
        await sql`ALTER TABLE users ADD CONSTRAINT users_user_type_check CHECK (user_type IN ('lister', 'renter'))`;
        
        console.log("✅ Users table updated");
        
        // Step 2: Create new houses table with updated schema
        console.log("Creating new houses table...");
        await sql`DROP TABLE IF EXISTS favorites CASCADE`;
        await sql`DROP TABLE IF EXISTS houses CASCADE`;
        
        await sql`
            CREATE TABLE houses (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                property_title VARCHAR(255) NOT NULL,
                images TEXT[] NOT NULL,
                monthly_rent DECIMAL(10,2) NOT NULL,
                address VARCHAR(255) NOT NULL,
                property_type VARCHAR(255) NOT NULL,
                rooms INT NOT NULL,
                bathrooms INT NOT NULL,
                square_feet INT NOT NULL,
                description TEXT NOT NULL,
                contact_name VARCHAR(255) NOT NULL,
                contact_email VARCHAR(255) NOT NULL,
                contact_phone VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        console.log("✅ Houses table recreated");
        
        // Step 3: Create favorites table
        console.log("Creating favorites table...");
        await sql`
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                house_id INT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, house_id)
            )
        `;
        
        console.log("✅ Favorites table created");
        
        console.log("🎉 Migration completed successfully!");
        process.exit(0);
        
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrate();
