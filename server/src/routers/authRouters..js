import { Router } from 'express';
import { login } from "../controllers/auth.Controller.mjs"; // only login

const router = Router();

// Admin login
router.post('/login', login);


export default router;
