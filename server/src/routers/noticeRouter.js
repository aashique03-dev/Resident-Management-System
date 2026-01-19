import {
    getAllNotices,
    getAllNoticeById,
    updateNotic,
    createNotic,
    deleteNotic
} from '../controllers/Notice.Controller.mjs';
import { Router } from 'express';
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateToken, authorizeRoles("admin"));


// GET all Notices
router.get("/notics", async (req, res) => {
    getAllNotices(req, res);
});
// Get notice by id
router.get("/notice/:id", async (req, res) => {
    getAllNoticeById(req, res);
});

// Update exiting Notic
router.patch("/notice/:id", async (req, res) => {
    updateNotic(req, res);
});
// Add new Notic 
router.post("/notice", async (req, res) => {
    createNotic(req, res);
});
// delete notic by id
router.delete("/notice/:id", async (req, res) => {
    deleteNotic(req, res);
})


export default router;