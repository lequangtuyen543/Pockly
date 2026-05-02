import { Router } from "express";
import * as controller from "../controllers/setting.controller";
import * as authMiddleware from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", authMiddleware.requireAuth, controller.index);
router.patch("/", authMiddleware.requireAuth, controller.upsert);

export const settingRoutes: Router = router;

