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
exports.validatePasswordChange = exports.buildUserEditPatch = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const role_model_1 = __importDefault(require("../models/role.model"));
const buildUserEditPatch = (req, admin) => __awaiter(void 0, void 0, void 0, function* () {
    if (!admin && (req.body.roleId !== undefined || req.body.status !== undefined)) {
        return {
            error: {
                code: 403,
                message: "Chỉ admin mới được cập nhật roleId hoặc status",
            },
        };
    }
    const patch = {};
    if (typeof req.body.username === "string") {
        patch.username = req.body.username.trim();
    }
    if (typeof req.body.avatar === "string") {
        patch.avatar = req.body.avatar;
    }
    if (admin && req.body.roleId !== undefined) {
        const roleId = String(req.body.roleId);
        if (!mongoose_1.default.Types.ObjectId.isValid(roleId)) {
            return {
                error: {
                    code: 400,
                    message: "roleId không hợp lệ",
                },
            };
        }
        const role = yield role_model_1.default.findOne({
            _id: roleId,
            deleted: false,
        });
        if (!role) {
            return {
                error: {
                    code: 400,
                    message: "Vai trò không tồn tại",
                },
            };
        }
        patch.roleId = role._id;
    }
    if (admin && req.body.status !== undefined) {
        if (!["active", "inactive"].includes(req.body.status)) {
            return {
                error: {
                    code: 400,
                    message: "status phải là active hoặc inactive",
                },
            };
        }
        patch.status = req.body.status;
    }
    if (Object.keys(patch).length === 0) {
        return {
            error: {
                code: 400,
                message: "Không có dữ liệu hợp lệ để cập nhật",
            },
        };
    }
    return { patch };
});
exports.buildUserEditPatch = buildUserEditPatch;
const validatePasswordChange = (payload) => {
    const body = payload;
    const oldPassword = typeof body.oldPassword === "string" ? body.oldPassword : undefined;
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : undefined;
    if (!oldPassword || !newPassword) {
        return {
            error: {
                code: 400,
                message: "Vui lòng gửi oldPassword và newPassword",
            },
        };
    }
    if (newPassword.length < 6) {
        return {
            error: {
                code: 400,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự",
            },
        };
    }
    return {
        data: {
            oldPassword,
            newPassword,
        },
    };
};
exports.validatePasswordChange = validatePasswordChange;
