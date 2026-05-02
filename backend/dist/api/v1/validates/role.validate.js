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
exports.validateRoleEdit = exports.validateRoleCreate = void 0;
const role_model_1 = __importDefault(require("../models/role.model"));
const validateRoleCreate = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, permissions } = req.body;
    if (typeof title !== "string" || !title.trim()) {
        return {
            error: {
                code: 400,
                message: "Vui lòng gửi title hợp lệ",
            },
        };
    }
    const trimmedTitle = title.trim();
    const existing = yield role_model_1.default.findOne({
        title: trimmedTitle,
        deleted: false,
    });
    if (existing) {
        return {
            error: {
                code: 400,
                message: "Tên vai trò đã tồn tại",
            },
        };
    }
    const desc = typeof description === "string" ? description.trim() : "";
    const perms = Array.isArray(permissions) ? permissions.filter((p) => typeof p === "string") : [];
    return {
        data: {
            title: trimmedTitle,
            description: desc,
            permissions: perms,
        },
    };
});
exports.validateRoleCreate = validateRoleCreate;
const validateRoleEdit = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, permissions } = req.body;
    const update = {};
    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            return {
                error: {
                    code: 400,
                    message: "Vui lòng gửi title hợp lệ",
                },
            };
        }
        const trimmedTitle = title.trim();
        const existing = yield role_model_1.default.findOne({
            title: trimmedTitle,
            deleted: false,
            _id: { $ne: id },
        });
        if (existing) {
            return {
                error: {
                    code: 400,
                    message: "Tên vai trò đã tồn tại",
                },
            };
        }
        update.title = trimmedTitle;
    }
    if (description !== undefined) {
        update.description = typeof description === "string" ? description.trim() : "";
    }
    if (permissions !== undefined) {
        if (!Array.isArray(permissions)) {
            return {
                error: {
                    code: 400,
                    message: "permissions phải là mảng",
                },
            };
        }
        update.permissions = permissions.filter((p) => typeof p === "string");
    }
    if (Object.keys(update).length === 0) {
        return {
            error: {
                code: 400,
                message: "Không có dữ liệu hợp lệ để cập nhật",
            },
        };
    }
    return { data: update };
});
exports.validateRoleEdit = validateRoleEdit;
