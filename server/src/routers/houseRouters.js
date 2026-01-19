import { Router } from "express";
import {
    houseget,
    housegetById,
    updateHouseById,
    createHouse,
    deleteHouseById
} from "../controllers/house.Controller.mjs";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();
router.use(authenticateToken, authorizeRoles("admin"));

// GET all Houses
router.get("/houses", async (req, res) => {
    houseget(req, res);
});
// Get house by id
router.get("/house/:id", async (req, res) => {
    housegetById(req, res);
});

// Update exiting House
router.patch("/house/:id", async (req, res) => {
    updateHouseById(req, res);
});
// Add new House 
router.post("/house", async (req, res) => {
    createHouse(req, res);
});
// delete house by id
router.delete("/house/:id", async (req, res) => {
    deleteHouseById(req, res);
})


export default router;