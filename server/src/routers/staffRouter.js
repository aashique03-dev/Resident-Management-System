import { Router } from "express";
import {
  getAllStaff,
  getStaffById,
  updateStaff,
  createStaff,
  deleteStaff
} from "../controllers/staff.Controller.mjs";

import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateToken, authorizeRoles("admin"));



// GET all Staff
router.get("/staff", async (req, res) => {
  getAllStaff(req, res);
});

// GET Staff by id
router.get("/staff/:id", async (req, res) => {
  getStaffById(req, res);
});

// Update exiting Staff
router.patch("/staff/:id", async (req, res) => {
  updateStaff(req, res);
});

// Add new Staff 
router.post("/staff", async (req, res) => {
  createStaff(req, res);
})

// delete staff by id
router.delete("/staff/:id", async (req, res) => {
  deleteStaff(req, res);
})


export default router;