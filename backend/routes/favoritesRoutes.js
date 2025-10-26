import express from "express";
import { addFavorite, removeFavorite, getFavorites, checkFavorite } from "../controllers/favoritesController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post("/", addFavorite);
router.delete("/:houseId", removeFavorite);
router.get("/", getFavorites);
router.get("/check/:houseId", checkFavorite);

export default router;
