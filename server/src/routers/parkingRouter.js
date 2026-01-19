import {
    getParking,
    getParkingById,
    updateParking,
    createParking,
    deleteParking
} from '../controllers/parking.Controller.mjs';
import { Router } from 'express';
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateToken, authorizeRoles("admin"));


// GET all Parking
router.get("/parking", async (req, res) => {
    getParking(req, res);
});

// GET Parking by id
router.get("/parking/:id", async (req, res) => {
    getParkingById(req, res);
});

// Update exiting Parking
router.patch("/parking/:id", async (req, res) => {
    updateParking(req, res);
});

// Add new Parking 
router.post("/parking", async (req, res) => {
    createParking(req, res);
})

// delete Parking by id
router.delete("/parking/:id", async (req, res) => {
    deleteParking(req, res);
})

export default router;