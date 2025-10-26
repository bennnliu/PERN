import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import houseRoutes from "./routes/houseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression for all responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Compression level (0-9, where 6 is default balance)
}));

// Increase payload limit to handle base64 images (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

//apply arcjet rate limiting and bot protection middleware
app.use(async (req, res, next) => { 
    try {
    const decision = await aj.protect(req, {
        requested:1
    });
    if (decision.isDenied()) {
       if(decision.reason.isRateLimit()){
            return res.status(429).json({ error: "Too many requests - please try again later." });
       }
       else if (decision.reason.isBot()) {
            return res.status(403).json({ error: "Access denied - bot traffic is not allowed." });
       }
       else {
            return res.status(403).json({ error: "Access denied." });
       }

    }
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed()) ) {
        res.status(403).json({ error: "Access denied - suspected bot traffic." });
        return;
    }
    next();
    }
    catch (error) {
        console.log("Arcjet middleware error:", error);
        next(error);
    }
})

app.use("/api/houses", houseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20),
                user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('lister', 'renter')),
                remember_token VARCHAR(255),
                reset_token VARCHAR(255),
                reset_token_expiry TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;
        
        await sql`
            CREATE TABLE IF NOT EXISTS houses (
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
            )`;
        
        await sql`
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                house_id INT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, house_id)
            )`;
        
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
