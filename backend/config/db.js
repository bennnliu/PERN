import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config(); // ✅ load .env before using process.env

const { PGUSER, PGHOST, PGDATABASE, PGPASSWORD } = process.env;

// Optional sanity check:
console.log("Loaded env:", { PGUSER, PGHOST, PGDATABASE, PGPASSWORD });

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);
