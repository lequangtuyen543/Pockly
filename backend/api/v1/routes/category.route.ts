import { Router } from "express";
import * as controller from "../controllers/category.controller";
import * as authMiddleware from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", controller.index);
router.post("/", authMiddleware.requireAuth, controller.create);
router.patch("/:id", authMiddleware.requireAuth, controller.edit);
router.delete("/:id", authMiddleware.requireAuth, controller.deleteRecord);

export const categoryRoutes: Router = router;

