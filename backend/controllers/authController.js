import { sql } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d";
const REMEMBER_ME_EXPIRES_IN = "30d";

export const register = async (req, res) => {
    try {
        const { email, password, phone_number, user_type } = req.body;
        
        if (!email || !password || !user_type) {
            return res.status(400).json({ error: "Email, password, and user type are required" });
        }
        
        if (!['lister', 'renter'].includes(user_type)) {
            return res.status(400).json({ error: "User type must be 'lister' or 'renter'" });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email" });
        if (password.length < 6) return res.status(400).json({ error: "Password must be 6+ characters" });
        
        const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existing.length > 0) return res.status(409).json({ error: "Email already registered" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await sql`
            INSERT INTO users (email, password, phone_number, user_type) 
            VALUES (${email}, ${hashedPassword}, ${phone_number || null}, ${user_type}) 
            RETURNING id, email, phone_number, user_type, created_at
        `;
        
        console.log("User registered:", newUser[0].email, "as", newUser[0].user_type);
        res.status(201).json({ message: "User registered successfully", user: newUser[0] });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });
        
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (users.length === 0) return res.status(401).json({ error: "Invalid email or password" });
        
        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Invalid email or password" });
        
        const expiresIn = rememberMe ? REMEMBER_ME_EXPIRES_IN : JWT_EXPIRES_IN;
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn });
        
        if (rememberMe) {
            const rememberToken = crypto.randomBytes(32).toString('hex');
            await sql`UPDATE users SET remember_token = ${rememberToken} WHERE id = ${user.id}`;
        }
        
        console.log("User logged in:", user.email);
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                phone_number: user.phone_number,
                user_type: user.user_type 
            } 
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Failed to login" });
    }
};

export const logout = async (req, res) => {
    try {
        await sql`UPDATE users SET remember_token = NULL WHERE id = ${req.user.userId}`;
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Failed to logout" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email required" });
        
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (users.length === 0) {
            return res.status(200).json({ message: "If email exists, reset link sent" });
        }
        
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        await sql`UPDATE users SET reset_token = ${resetToken}, reset_token_expiry = ${resetTokenExpiry} WHERE id = ${users[0].id}`;
        
        res.status(200).json({ message: "If email exists, reset link sent", resetToken });
    } catch (error) {
        res.status(500).json({ error: "Failed to process request" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ error: "Token and password required" });
        if (newPassword.length < 6) return res.status(400).json({ error: "Password must be 6+ characters" });
        
        const users = await sql`SELECT * FROM users WHERE reset_token = ${token} AND reset_token_expiry > NOW()`;
        if (users.length === 0) return res.status(400).json({ error: "Invalid or expired token" });
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await sql`UPDATE users SET password = ${hashedPassword}, reset_token = NULL, reset_token_expiry = NULL WHERE id = ${users[0].id}`;
        
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ error: "Failed to reset password" });
    }
};

export const verifyToken = async (req, res) => {
    try {
        const userId = req.user.userId;
        const users = await sql`SELECT id, email, phone_number, user_type FROM users WHERE id = ${userId}`;
        
        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ 
            message: "Token valid", 
            user: users[0]
        });
    } catch (error) {
        console.error("Error in verifyToken:", error);
        res.status(500).json({ error: "Failed to verify token" });
    }
};
