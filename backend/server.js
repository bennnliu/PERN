import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import houseRoutes from "./routes/houseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
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

async function initDB() {
    try {
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
            )`;
        
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                remember_token VARCHAR(255),
                reset_token VARCHAR(255),
                reset_token_expiry TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
