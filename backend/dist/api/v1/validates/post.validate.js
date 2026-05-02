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
exports.validatePostEdit = exports.validatePostCreate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const category_model_1 = __importDefault(require("../models/category.model"));
const validatePostCreate = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, thumbnail, categoryId } = req.body;
    if (typeof title !== "string" || !title.trim()) {
        return {
            error: {
                code: 400,
                message: "Vui lòng gửi title hợp lệ",
            },
        };
    }
    if (typeof content !== "string" || !content.trim()) {
        return {
            error: {
                code: 400,
                message: "Vui lòng gửi content hợp lệ",
            },
        };
    }
    if (typeof categoryId !== "string" || !mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
        return {
            error: {
                code: 400,
                message: "categoryId không hợp lệ",
            },
        };
    }
    const category = yield category_model_1.default.findOne({
        _id: categoryId,
        deleted: false,
        status: "active",
    });
    if (!category) {
        return {
            error: {
                code: 400,
                message: "Danh mục không tồn tại hoặc không khả dụng",
            },
        };
    }
    return {
        data: {
            title: title.trim(),
            content: content.trim(),
            thumbnail: typeof thumbnail === "string" ? thumbnail : "",
            categoryId,
        },
    };
});
exports.validatePostCreate = validatePostCreate;
const validatePostEdit = (req, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, thumbnail, categoryId, status } = req.body;
    if (!isAdmin && status !== undefined) {
        return {
            error: {
                code: 403,
                message: "Chỉ admin mới được cập nhật status",
            },
        };
    }
    const patch = {};
    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            return {
                error: {
                    code: 400,
                    message: "Vui lòng gửi title hợp lệ",
                },
            };
        }
        patch.title = title.trim();
    }
    if (content !== undefined) {
        if (typeof content !== "string" || !content.trim()) {
            return {
                error: {
                    code: 400,
                    message: "Vui lòng gửi content hợp lệ",
                },
            };
        }
        patch.content = content.trim();
    }
    if (thumbnail !== undefined) {
        patch.thumbnail = typeof thumbnail === "string" ? thumbnail : "";
    }
    if (categoryId !== undefined) {
        const cid = String(categoryId);
        if (!mongoose_1.default.Types.ObjectId.isValid(cid)) {
            return {
                error: {
                    code: 400,
                    message: "categoryId không hợp lệ",
                },
            };
        }
        const category = yield category_model_1.default.findOne({
            _id: cid,
            deleted: false,
            status: "active",
        });
        if (!category) {
            return {
                error: {
                    code: 400,
                    message: "Danh mục không tồn tại hoặc không khả dụng",
                },
            };
        }
        patch.categoryId = cid;
    }
    if (isAdmin && status !== undefined) {
        if (!["active", "inactive"].includes(status)) {
            return {
                error: {
                    code: 400,
                    message: "status phải là active hoặc inactive",
                },
            };
        }
        patch.status = status;
    }
    if (Object.keys(patch).length === 0) {
        return {
            error: {
                code: 400,
                message: "Không có dữ liệu hợp lệ để cập nhật",
            },
        };
    }
    return { data: patch };
});
exports.validatePostEdit = validatePostEdit;
