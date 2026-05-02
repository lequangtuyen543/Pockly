"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const role_model_1 = __importDefault(require("../models/role.model"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            res.json({
                code: 400,
                message: "Vui lòng gửi kèm token!",
            });
            return;
        }
        const tokenParts = req.headers.authorization.split(" ");
        if (tokenParts.length !== 2 || !tokenParts[1]) {
            res.json({
                code: 400,
                message: "token không hợp lệ!",
            });
            return;
        }
        const token = tokenParts[1];
        const user = yield user_model_1.default.findOne({
            token,
            deleted: false,
        })
            .select("-password")
            .lean();
        if (!user) {
            res.json({
                code: 400,
                message: "token không hợp lệ!",
            });
            return;
        }
        const roleInfo = yield role_model_1.default.findOne({
            _id: user.roleId,
        })
            .select("title permissions")
            .lean();
        if (roleInfo) {
            user["role"] = roleInfo;
        }
        res.locals.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.requireAuth = requireAuth;
