import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router: Router = Router();

// POST /api/v1/auth/register
router.post("/register", authController.register);

// POST /api/v1/auth/login
router.post("/login", authController.login);

export const authRoutes: Router = router;

