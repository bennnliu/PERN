import { sql } from "../config/db.js";

//CRUD Operations for House Listings
export const getHouses = async (req, res) => {
    try {
        const houses = await sql`
        SELECT * FROM houses ORDER BY created_at DESC
        `;
        res.status(200).json(houses);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve houses" });
    }
    res.send("Retrieve all houses");
}
export const getHouse = async (req, res) => {
    const { id } = req.params;
    try {
        const house = await sql`
        SELECT * FROM houses WHERE id = ${id}
        `;
        if (house.length === 0) {
            return res.status(404).json({ error: "House not found" });
        }
        res.status(200).json(house[0]);
    } 
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve house" });
    }
    res.send("Retrieve a single house by ID");
}
export const createHouse= async (req, res) => {
    const { property_title, image, montly_rent, address, property_type, rooms, bathrooms, square_feet, description } = req.body;
    if (!property_title || !image || !montly_rent || !address || !property_type || !rooms || !bathrooms || !square_feet || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const newHouse = await sql`
        INSERT INTO houses (property_title, image, montly_rent, address, property_type, rooms, bathrooms, square_feet, description)
        VALUES (${property_title}, ${image}, ${montly_rent}, ${address}, ${property_type}, ${rooms}, ${bathrooms}, ${square_feet}, ${description})
        RETURNING *;
        `;
        res.status(201).json(newHouse);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create house listing" });
    }
    res.send("Create a new house listing");
}
export const updateHouse = async (req, res) => {
    const { id } = req.params;
    const { property_title, image, montly_rent, address, property_type, rooms, bathrooms, square_feet, description } = req.body;
    if (!property_title || !image || !montly_rent || !address || !property_type || !rooms || !bathrooms || !square_feet || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const updatedHouse = await sql`
        UPDATE houses 
        SET property_title = ${property_title}, image = ${image}, montly_rent = ${montly_rent}, address = ${address}, property_type = ${property_type}, rooms = ${rooms}, bathrooms = ${bathrooms}, square_feet = ${square_feet}, description = ${description}
        WHERE id = ${id}
        RETURNING *;
        `;
        if (updatedHouse.length === 0) {
            return res.status(404).json({ error: "House not found" });
        }
        res.status(200).json(updatedHouse[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update house listing" });
    }
    res.send("Update an existing house by ID");
}
export const deleteHouse = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedHouse = await sql`
        DELETE FROM houses WHERE id = ${id} RETURNING *;
        `;
        if (deletedHouse.length === 0) {
            return res.status(404).json({ error: "House not found" });
        }
        res.status(200).json({ message: "House deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete house listing" });
    }
    // Logic to delete a house by ID from the database
    res.send("Delete a house by ID");
}