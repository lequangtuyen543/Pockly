"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateHelper = __importStar(require("../../../helpers/generate"));
const role_model_1 = __importDefault(require("../models/role.model"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, username, password } = req.body;
        if (typeof fullName !== "string" ||
            typeof email !== "string" ||
            typeof username !== "string" ||
            typeof password !== "string" ||
            !fullName.trim() ||
            !email.trim() ||
            !username.trim() ||
            !password) {
            res.status(400).json({
                code: 400,
                message: "Vui lòng gửi đầy đủ fullName, email, username và password",
            });
            return;
        }
        const existEmail = yield user_model_1.default.findOne({
            email,
            deleted: false,
        });
        if (existEmail) {
            res.status(400).json({
                code: 400,
                message: "Email đã tồn tại!",
            });
            return;
        }
        const existUsername = yield user_model_1.default.findOne({
            username,
            deleted: false,
        });
        if (existUsername) {
            res.status(400).json({
                code: 400,
                message: "Tên đăng nhập đã tồn tại!",
            });
            return;
        }
        let defaultRole = yield role_model_1.default.findOne({
            title: { $in: ["User", "user", "USER"] },
            deleted: false,
        });
        if (!defaultRole) {
            defaultRole = yield role_model_1.default.findOne({ deleted: false });
        }
        if (!defaultRole) {
            defaultRole = yield new role_model_1.default({
                title: "User",
                description: "Default user role",
                permissions: [],
            }).save();
        }
        const user = new user_model_1.default({
            fullName: fullName.trim(),
            email: email.trim(),
            username: username.trim(),
            password: (0, md5_1.default)(password),
            token: generateHelper.generateRandomString(20),
            roleId: defaultRole._id,
        });
        yield user.save();
        const token = user.get("token");
        res.cookie("token", token, { httpOnly: true });
        res.json({
            code: 200,
            message: "Đăng ký thành công!",
            token,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Lỗi máy chủ";
        res.status(500).json({
            code: 500,
            message,
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (typeof username !== "string" || typeof password !== "string") {
            res.status(400).json({
                code: 400,
                message: "Vui lòng gửi username và password",
            });
            return;
        }
        const user = yield user_model_1.default.findOne({
            username,
            deleted: false,
        }).select("+password");
        if (!user) {
            res.status(400).json({
                code: 400,
                message: "username không tồn tại!",
            });
            return;
        }
        if ((0, md5_1.default)(password) !== user.get("password")) {
            res.status(400).json({
                code: 400,
                message: "Sai mật khẩu!",
            });
            return;
        }
        const token = user.get("token");
        res.cookie("token", token, { httpOnly: true });
        const safeUser = user.toObject();
        delete safeUser.password;
        res.json({
            code: 200,
            message: "Đăng nhập thành công!",
            token,
            user: safeUser,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Lỗi máy chủ";
        res.status(500).json({
            code: 500,
            message,
        });
    }
});
exports.login = login;
