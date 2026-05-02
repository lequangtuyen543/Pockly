import { Router } from "express";
import * as controller from "../controllers/role.controller";
import * as authMiddleware from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", authMiddleware.requireAuth, controller.index);
router.post("/", authMiddleware.requireAuth, controller.createRecord);
router.patch("/:id", authMiddleware.requireAuth, controller.editRecord);
router.delete("/:id", authMiddleware.requireAuth, controller.deleteRecord);

export const roleRoutes: Router = router;