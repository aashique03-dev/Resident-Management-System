import { Router } from "express";
import {
  getResident,
  getResidentById,
  updateResident,
  createResident,
  deleteResident
} from "../controllers/resident.controller.mjs";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateToken, authorizeRoles("admin"));

// GET all Residents
router.get("/residents", async (req, res) => {
  getResident(req, res);
});

// GET Residents by id
router.get("/residents/:id", async (req, res) => {
  getResidentById(req, res);
});

// Update exiting Residents
router.patch("/residents/:id", async (req, res) => {
  updateResident(req, res);
});

// Add new Residents 
router.post("/residents", async (req, res) => {
  createResident(req, res);
})

// delete employee by id
router.delete("/residents/:id", async (req, res) => {
  deleteResident(req, res);
})

export default router;