import { sql } from "../config/db.js";

export const addFavorite = async (req, res) => {
    try {
        const { houseId } = req.body;
        const userId = req.user.userId;
        
        if (!houseId) {
            return res.status(400).json({ error: "House ID is required" });
        }
        
        // Check if already favorited
        const existing = await sql`
            SELECT * FROM favorites 
            WHERE user_id = ${userId} AND house_id = ${houseId}
        `;
        
        if (existing.length > 0) {
            return res.status(409).json({ error: "Already favorited" });
        }
        
        await sql`
            INSERT INTO favorites (user_id, house_id)
            VALUES (${userId}, ${houseId})
        `;
        
        res.status(201).json({ message: "Added to favorites" });
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ error: "Failed to add favorite" });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { houseId } = req.params;
        const userId = req.user.userId;
        
        await sql`
            DELETE FROM favorites 
            WHERE user_id = ${userId} AND house_id = ${houseId}
        `;
        
        res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ error: "Failed to remove favorite" });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const favorites = await sql`
            SELECT h.*, f.created_at as favorited_at
            FROM favorites f
            JOIN houses h ON f.house_id = h.id
            WHERE f.user_id = ${userId}
            ORDER BY f.created_at DESC
        `;
        
        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error getting favorites:", error);
        res.status(500).json({ error: "Failed to get favorites" });
    }
};

export const checkFavorite = async (req, res) => {
    try {
        const { houseId } = req.params;
        const userId = req.user.userId;
        
        const favorite = await sql`
            SELECT * FROM favorites 
            WHERE user_id = ${userId} AND house_id = ${houseId}
        `;
        
        res.status(200).json({ isFavorite: favorite.length > 0 });
    } catch (error) {
        console.error("Error checking favorite:", error);
        res.status(500).json({ error: "Failed to check favorite" });
    }
};
