import Router from "express";
import {
    getRequests,
    getRequestById,
    updateRequest,  // ✅ Changed from createRequest
    deleteRequest
} from "../controllers/request.Controller.mjs";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateToken, authorizeRoles("admin"));

// GET all Requests
router.get("/requests", getRequests);

// GET a single Request by ID
router.get("/request/:id", getRequestById);

// ✅ CHANGED: PATCH to assign/update request (admin assigns staff)
router.patch("/request/:id", updateRequest);

// DELETE a Request
router.delete("/request/:id", deleteRequest);

export default router;