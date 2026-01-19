import { Router } from "express";
import {getNotice } from "../controllers/residentNotice.Controller.mjs"
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/my/notice",
    authenticateToken,
    authorizeRoles("resident", "rental", "owner", "admin"),
    getNotice
);

export default router;
