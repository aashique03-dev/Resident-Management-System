import { Router } from "express";
import { getMybills } from "../controllers/residentBills.Controller.mjs";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// ✅ Changed from /resident/bills to /my/bills
router.get("/my/bills", 
    authenticateToken, 
    authorizeRoles("resident", "rental", "owner", "admin"), 
    getMybills
);

export default router;