import { sql } from "../config/db.js";

//CRUD Operations for House Listings
export const getHouses = async (req, res) => {
    try {
        console.log("🔍 Attempting to fetch houses...");
        
        // Test database connection first
        const testConnection = await sql`SELECT 1;`;
        console.log("✅ Database connection test:", testConnection);

        const houses = await sql`
            SELECT * FROM houses ORDER BY created_at DESC;
        `;
        console.log("📦 Retrieved houses:", houses);
        
        res.status(200).json(houses);
    } catch (error) {
        console.error("🔥 Error in getHouses:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            details: error.details
        });
        res.status(500).json({ 
            error: "Failed to retrieve houses",
            details: error.message,
            code: error.code
        });
    }
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
export const createHouse = async (req, res) => {
  try {
    console.log("📦 Incoming request:", {
      headers: req.headers,
      body: req.body,
    });

    const {
      property_title,
      image,
      monthly_rent,
      address,
      property_type,
      rooms,
      bathrooms,
      square_feet,
      description,
    } = req.body;

    // Detailed validation with specific error messages
    const requiredFields = {
      property_title,
      image,
      monthly_rent,
      address,
      property_type,
      rooms,
      bathrooms,
      square_feet,
      description,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      console.log("❌ Missing fields:", missingFields);
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
    }

    // Type validation
    if (typeof monthly_rent !== 'number') {
      return res.status(400).json({
        error: "Invalid field type",
        field: "monthly_rent",
        expected: "number",
        received: typeof monthly_rent
      });
    }

    console.log("✅ Validation passed, inserting into database...");

    const result = await sql`
      INSERT INTO houses (
        property_title,
        image,
        monthly_rent,
        address,
        property_type,
        rooms,
        bathrooms,
        square_feet,
        description
      ) VALUES (
        ${property_title},
        ${image},
        ${monthly_rent},
        ${address},
        ${property_type},
        ${rooms},
        ${bathrooms},
        ${square_feet},
        ${description}
      )
      RETURNING *;
    `;

    console.log("✅ Insert successful:", result);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("🔥 Error creating house:", {
      message: error.message,
      stack: error.stack,
      details: error.details,
    });
    res.status(500).json({
      error: "Failed to create house listing",
      details: error.message,
    });
  }
};

export const updateHouse = async (req, res) => {
    const { id } = req.params;
    const { property_title, image, monthly_rent, address, property_type, rooms, bathrooms, square_feet, description } = req.body;
    if (!property_title || !image || !monthly_rent || !address || !property_type || !rooms || !bathrooms || !square_feet || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const updatedHouse = await sql`
        UPDATE houses 
        SET property_title = ${property_title}, image = ${image}, monthly_rent = ${monthly_rent}, address = ${address}, property_type = ${property_type}, rooms = ${rooms}, bathrooms = ${bathrooms}, square_feet = ${square_feet}, description = ${description}
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