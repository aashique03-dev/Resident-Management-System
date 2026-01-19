import { Router } from "express";
import {
    getReq,
    getReqById,  // ✅ ADD THIS
    addReq,
    updateReq
} from "../controllers/residentReq.Controller.mjs";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// GET all requests for logged-in resident
router.get("/my/request",
    authenticateToken,
    authorizeRoles("resident", "rental", "owner", "admin"),
    getReq
);

// ✅ ADD THIS - GET single request by ID for editing
router.get("/resident/request/:id",
    authenticateToken,
    authorizeRoles("resident", "rental", "owner", "admin"),
    getReqById
);

// CREATE new request
router.post("/resident/request",
    authenticateToken,
    authorizeRoles("resident", "rental", "owner", "admin"),
    addReq
);

// UPDATE request
router.patch("/resident/request/:id",
    authenticateToken,
    authorizeRoles("resident", "rental", "owner", "admin"),
    updateReq
);

export default router;