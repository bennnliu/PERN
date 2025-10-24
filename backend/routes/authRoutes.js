import express from "express";
import { register, login, logout, forgotPassword, resetPassword, verifyToken } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", authenticateToken, logout);
router.get("/verify", authenticateToken, verifyToken);

export default router;
