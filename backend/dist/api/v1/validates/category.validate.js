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
exports.validateCategoryEdit = exports.validateCategoryCreate = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const validateCategoryCreate = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, slug } = req.body;
    if (typeof title !== "string" || !title.trim()) {
        return {
            error: {
                code: 400,
                message: "Vui lòng gửi title hợp lệ",
            },
        };
    }
    if (typeof slug !== "string" || !slug.trim()) {
        return {
            error: {
                code: 400,
                message: "Vui lòng gửi slug hợp lệ",
            },
        };
    }
    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim().toLowerCase();
    const existTitle = yield category_model_1.default.findOne({
        title: trimmedTitle,
        deleted: false,
    });
    if (existTitle) {
        return {
            error: {
                code: 400,
                message: "Tiêu đề danh mục đã tồn tại",
            },
        };
    }
    const existSlug = yield category_model_1.default.findOne({
        slug: trimmedSlug,
        deleted: false,
    });
    if (existSlug) {
        return {
            error: {
                code: 400,
                message: "Slug đã tồn tại",
            },
        };
    }
    return {
        data: {
            title: trimmedTitle,
            slug: trimmedSlug,
        },
    };
});
exports.validateCategoryCreate = validateCategoryCreate;
const validateCategoryEdit = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, slug, status } = req.body;
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
        const existTitle = yield category_model_1.default.findOne({
            title: trimmedTitle,
            deleted: false,
            _id: { $ne: id },
        });
        if (existTitle) {
            return {
                error: {
                    code: 400,
                    message: "Tiêu đề danh mục đã tồn tại",
                },
            };
        }
        update.title = trimmedTitle;
    }
    if (slug !== undefined) {
        if (typeof slug !== "string" || !slug.trim()) {
            return {
                error: {
                    code: 400,
                    message: "Vui lòng gửi slug hợp lệ",
                },
            };
        }
        const trimmedSlug = slug.trim().toLowerCase();
        const existSlug = yield category_model_1.default.findOne({
            slug: trimmedSlug,
            deleted: false,
            _id: { $ne: id },
        });
        if (existSlug) {
            return {
                error: {
                    code: 400,
                    message: "Slug đã tồn tại",
                },
            };
        }
        update.slug = trimmedSlug;
    }
    if (status !== undefined) {
        if (!["active", "inactive"].includes(status)) {
            return {
                error: {
                    code: 400,
                    message: "status phải là active hoặc inactive",
                },
            };
        }
        update.status = status;
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
exports.validateCategoryEdit = validateCategoryEdit;
