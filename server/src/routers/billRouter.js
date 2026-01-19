import { Router } from "express";
import {
  getBills,
  getBillById,
  updateBill,
  createBill,
  deleteBill
} from "../controllers/bills.Controller.mjs";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// GET all Bills
router.get("/bills", authenticateToken, authorizeRoles("admin"), getBills);

// GET Bill by id
router.get("/bill/:id", authenticateToken, authorizeRoles("admin"), getBillById);

// update Bill by id
router.put("/bill/:id", authenticateToken, authorizeRoles("admin"), updateBill);

// create Bill
router.post("/bill", authenticateToken, authorizeRoles("admin"), createBill);

// delete Bill by id
router.delete("/bill/:id", authenticateToken, authorizeRoles("admin"), deleteBill);

export default router;