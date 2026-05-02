import { Router } from "express";
import * as controller from "../controllers/post.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
const router: Router = Router();

router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.post("/create", authMiddleware.requireAuth, controller.create);
router.patch("/edit/:id", authMiddleware.requireAuth, controller.edit);
router.delete("/delete/:id", authMiddleware.requireAuth, controller.deletePost);

export const postRoutes: Router = router;