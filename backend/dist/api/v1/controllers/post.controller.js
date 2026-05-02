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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.edit = exports.create = exports.detail = exports.index = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post.model"));
const search_1 = __importDefault(require("../../../helpers/search"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const user_helper_1 = require("../helpers/user.helper");
const post_helper_1 = require("../helpers/post.helper");
const post_validate_1 = require("../validates/post.validate");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const find = {
            deleted: false,
            status: "active",
        };
        if (req.query.categoryId) {
            const cid = req.query.categoryId.toString();
            if (!mongoose_1.default.Types.ObjectId.isValid(cid)) {
                res.status(400).json({
                    code: 400,
                    message: "categoryId không hợp lệ",
                    data: null,
                });
                return;
            }
            find.categoryId = cid;
        }
        const objectSearch = (0, search_1.default)(req.query);
        if (req.query.keyword && objectSearch.regex) {
            find.title = objectSearch.regex;
        }
        const initPagination = {
            currentPage: 1,
            limitItems: 5,
        };
        const countPosts = yield post_model_1.default.countDocuments(find);
        const objectPagination = (0, pagination_1.default)(initPagination, req.query, countPosts);
        const allowedSortKeys = new Set(["title", "createdAt"]);
        let sortKey = "createdAt";
        if (req.query.sortKey) {
            const k = req.query.sortKey.toString();
            if (allowedSortKeys.has(k))
                sortKey = k;
        }
        const sortDir = ((_a = req.query.sortValue) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) === "asc" ? 1 : -1;
        const sort = { [sortKey]: sortDir };
        const posts = yield post_model_1.default.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip((_b = objectPagination.skip) !== null && _b !== void 0 ? _b : 0)
            .populate("userId", "username")
            .populate("categoryId", "title slug")
            .lean();
        res.json({
            code: 200,
            message: "Success",
            data: posts,
            pagination: {
                currentPage: objectPagination.currentPage,
                limitItems: objectPagination.limitItems,
                totalItems: countPosts,
                totalPages: (_c = objectPagination.totalPages) !== null && _c !== void 0 ? _c : 0,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({
            code: 500,
            message,
            data: null,
        });
    }
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (0, user_helper_1.getParamId)(req);
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            code: 400,
            message: "Id không hợp lệ",
            data: null,
        });
        return;
    }
    const post = yield post_model_1.default.findOne({
        _id: id,
        deleted: false,
        status: "active",
    })
        .populate("userId", "username")
        .populate("categoryId", "title")
        .lean();
    if (!post) {
        res.status(404).json({
            code: 404,
            message: "Không tìm thấy bài viết",
            data: null,
        });
        return;
    }
    const doc = post;
    const { userId, categoryId } = doc, rest = __rest(doc, ["userId", "categoryId"]);
    res.json({
        code: 200,
        message: "Success",
        data: Object.assign(Object.assign({}, rest), { user: userId
                ? { _id: userId._id, username: (_a = userId.username) !== null && _a !== void 0 ? _a : "" }
                : null, category: categoryId
                ? { _id: categoryId._id, title: (_b = categoryId.title) !== null && _b !== void 0 ? _b : "" }
                : null }),
    });
});
exports.detail = detail;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const me = res.locals.user;
        const { data, error } = yield (0, post_validate_1.validatePostCreate)(req);
        if (error) {
            res.status(error.code).json({
                code: error.code,
                message: error.message,
                data: null,
            });
            return;
        }
        const record = new post_model_1.default({
            title: data.title,
            content: data.content,
            thumbnail: data.thumbnail,
            categoryId: data.categoryId,
            userId: me._id,
            status: "active",
            deleted: false,
        });
        const saved = yield record.save();
        const populated = yield post_model_1.default.findById(saved._id)
            .populate("userId", "username")
            .populate("categoryId", "title")
            .lean();
        const p = populated;
        if (!p) {
            res.json({
                code: 200,
                message: "Tạo thành công!",
                data: saved,
            });
            return;
        }
        const { userId, categoryId: cat } = p, rest = __rest(p, ["userId", "categoryId"]);
        res.json({
            code: 200,
            message: "Tạo thành công!",
            data: Object.assign(Object.assign({}, rest), { user: userId
                    ? { _id: userId._id, username: (_a = userId.username) !== null && _a !== void 0 ? _a : "" }
                    : null, category: cat
                    ? { _id: cat._id, title: (_b = cat.title) !== null && _b !== void 0 ? _b : "" }
                    : null }),
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Lỗi!";
        res.status(500).json({
            code: 500,
            message,
            data: null,
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = (0, user_helper_1.getParamId)(req);
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                code: 400,
                message: "Id không hợp lệ",
                data: null,
            });
            return;
        }
        const me = res.locals.user;
        const post = yield post_model_1.default.findOne({ _id: id, deleted: false });
        if (!post) {
            res.status(404).json({
                code: 404,
                message: "Không tìm thấy bài viết",
                data: null,
            });
            return;
        }
        if (!(0, post_helper_1.ownerOrAdmin)(post.userId, me)) {
            res.status(403).json({
                code: 403,
                message: "Không có quyền chỉnh sửa bài viết này",
                data: null,
            });
            return;
        }
        const { data, error } = yield (0, post_validate_1.validatePostEdit)(req, (0, user_helper_1.isAdmin)(me));
        if (error) {
            res.status(error.code).json({
                code: error.code,
                message: error.message,
                data: null,
            });
            return;
        }
        const updated = yield post_model_1.default.findOneAndUpdate({ _id: id, deleted: false }, { $set: data }, { new: true, runValidators: true })
            .populate("userId", "username")
            .populate("categoryId", "title")
            .lean();
        if (!updated) {
            res.status(404).json({
                code: 404,
                message: "Không tìm thấy bài viết",
                data: null,
            });
            return;
        }
        const doc = updated;
        const { userId, categoryId } = doc, rest = __rest(doc, ["userId", "categoryId"]);
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
            data: Object.assign(Object.assign({}, rest), { user: userId
                    ? { _id: userId._id, username: (_a = userId.username) !== null && _a !== void 0 ? _a : "" }
                    : null, category: categoryId
                    ? { _id: categoryId._id, title: (_b = categoryId.title) !== null && _b !== void 0 ? _b : "" }
                    : null }),
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Lỗi!";
        res.status(500).json({
            code: 500,
            message,
            data: null,
        });
    }
});
exports.edit = edit;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, user_helper_1.getParamId)(req);
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                code: 400,
                message: "Id không hợp lệ",
                data: null,
            });
            return;
        }
        const me = res.locals.user;
        const post = yield post_model_1.default.findOne({ _id: id, deleted: false });
        if (!post) {
            res.status(404).json({
                code: 404,
                message: "Không tìm thấy bài viết",
                data: null,
            });
            return;
        }
        if (!(0, post_helper_1.ownerOrAdmin)(post.userId, me)) {
            res.status(403).json({
                code: 403,
                message: "Không có quyền xóa bài viết này",
                data: null,
            });
            return;
        }
        yield post_model_1.default.updateOne({ _id: id }, { $set: { deleted: true } });
        res.json({
            code: 200,
            message: "Xóa thành công!",
            data: null,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Lỗi!";
        res.status(500).json({
            code: 500,
            message,
            data: null,
        });
    }
});
exports.deletePost = deletePost;
