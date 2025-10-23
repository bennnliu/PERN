import express from "express";
import { getHouses } from "../controllers/houseController.js";
import { createHouse} from "../controllers/houseController.js";
import { getHouse } from "../controllers/houseController.js";
import { updateHouse } from "../controllers/houseController.js";
import { deleteHouse } from "../controllers/houseController.js";1

const router = express.Router();

router.get("/", getHouses);
router.get("/:id", getHouse);
router.post("/",createHouse)
router.put("/:id", updateHouse);
router.delete("/:id", deleteHouse);

export default router;