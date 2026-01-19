import { Router } from "express";
import { getResidentInfoById } from "../controllers/residentInfo.Controller.mjs"
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// ✅ No :id parameter - we'll use req.user.id from JWT token
router.get("/profile", 
    authenticateToken, 
    authorizeRoles("resident", "rental", "owner", "admin"), 
    getResidentInfoById
);

export default router;