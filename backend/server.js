import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import houseRoutes from "./routes/houseRoutes.js";
import { sql } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api", houseRoutes);

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS houses (
                id SERIAL PRIMARY KEY,
                propety_title VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                montly_rent DECIMAL(10,2) NOT NULL,
                address VARCHAR(255) NOT NULL,
                property_type VARCHAR(255) NOT NULL,
                rooms INT NOT NULL,
                bathrooms INT NOT NULL,
                square_feet INT NOT NULL,
                description VARCHAR(255) NOT NULL,
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
