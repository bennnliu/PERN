import arcjet, {shield, detectBot, tokenBucket } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();

//init arcjet
export const aj = arcjet({
    apiKey: process.env.ARCJET_API_KEY,
    characteristics: ["ip.src"],
    rules: [
        shield({mode:"LIVE"}), // Enable Shield in LIVE mode, protects you from attacks
        detectBot({
            mode: "LIVE", // Set to LIVE to block bots except search engines 
            allow: [
            "CATEGORY:SEARCH_ENGINE", // Allow search engines like Googlebot
            ],
        }),
        tokenBucket({
            mode: "LIVE", // Set to LIVE to enforce rate limiting
            refillRate: 5, // 5 tokens per second
            interval: 10, // refill interval in seconds
            capacity: 10, // maximum bucket size
        }),
    ],
});
