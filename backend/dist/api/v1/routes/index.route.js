"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = require("./auth.route");
const user_route_1 = require("./user.route");
const post_route_1 = require("./post.route");
const role_route_1 = require("./role.route");
const category_route_1 = require("./category.route");
const setting_route_1 = require("./setting.route");
const mainV1Routes = (app) => {
    const version = "/api/v1";
    app.use(version + "/auth", auth_route_1.authRoutes);
    app.use(version + "/posts", post_route_1.postRoutes);
    app.use(version + "/users", user_route_1.userRoutes);
    app.use(version + "/roles", role_route_1.roleRoutes);
    app.use(version + "/categories", category_route_1.categoryRoutes);
    app.use(version + "/settings", setting_route_1.settingRoutes);
};
exports.default = mainV1Routes;
