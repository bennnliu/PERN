import express from "express";
import { getHouses, getUserHouses, createHouse, getHouse, updateHouse, deleteHouse } from "../controllers/houseController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getHouses);
router.get("/:id", getHouse);

// Protected routes (require authentication)
router.get("/user/my-listings", authenticateToken, getUserHouses);
router.post("/", authenticateToken, createHouse);
router.put("/:id", authenticateToken, updateHouse);
router.delete("/:id", authenticateToken, deleteHouse);

export default router;