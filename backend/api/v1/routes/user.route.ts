import { Router } from "express";
import * as controller from "../controllers/user.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
const router: Router = Router();

// GET /api/v1/users (Admin)
router.get("/", authMiddleware.requireAuth, controller.list);

router.get("/info", authMiddleware.requireAuth, controller.info);
router.patch("/edit/:id", authMiddleware.requireAuth, controller.edit);
router.patch("/change-password", authMiddleware.requireAuth, controller.changePassword);

export const userRoutes: Router = router;
