import { Express } from "express";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
import { postRoutes } from "./post.route";
import { roleRoutes } from "./role.route";
import { categoryRoutes } from "./category.route";
import { settingRoutes } from "./setting.route";

const mainV1Routes = (app: Express): void => {
  const version = "/api/v1";

  // Auth
  app.use(version + "/auth", authRoutes);

  // Public/Protected
  app.use(version + "/posts", postRoutes);
  app.use(version + "/users", userRoutes);

  // Admin modules (API design still uses /roles, /categories, /settings)
  app.use(version + "/roles", roleRoutes);
  app.use(version + "/categories", categoryRoutes);
  app.use(version + "/settings", settingRoutes);
};

export default mainV1Routes;