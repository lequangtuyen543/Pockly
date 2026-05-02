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
exports.changePassword = exports.edit = exports.list = exports.info = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../models/user.model"));
const search_1 = __importDefault(require("../../../helpers/search"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const user_helper_1 = require("../helpers/user.helper");
const user_validate_1 = require("../validates/user.validate");
const info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const raw = res.locals.user;
    const safe = Object.assign({}, raw);
    delete safe.password;
    delete safe.token;
    res.json({
        code: 200,
        message: "Thành công",
        data: safe,
    });
});
exports.info = info;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const me = res.locals.user;
        if (!(0, user_helper_1.isAdmin)(me)) {
            res.status(403).json({
                code: 403,
                message: "Không có quyền truy cập",
                data: null,
            });
            return;
        }
        const find = {
            deleted: false,
        };
        if (req.query.keyword) {
            const objectSearch = (0, search_1.default)(req.query);
            if (objectSearch.regex) {
                find.$or = [
                    { username: objectSearch.regex },
                    { email: objectSearch.regex },
                ];
            }
        }
        const initPagination = {
            currentPage: 1,
            limitItems: 10,
        };
        const countUsers = yield user_model_1.default.countDocuments(find);
        const objectPagination = (0, pagination_1.default)(initPagination, req.query, countUsers);
        const sort = { createdAt: -1 };
        const users = yield user_model_1.default.find(find)
            .select("-password -token")
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip((_a = objectPagination.skip) !== null && _a !== void 0 ? _a : 0)
            .populate("roleId", "title permissions")
            .lean();
        const data = users.map((u) => (0, user_helper_1.normalizeUserWithRole)(u));
        res.json({
            code: 200,
            message: "Success",
            data,
            pagination: {
                currentPage: objectPagination.currentPage,
                limitItems: objectPagination.limitItems,
                totalItems: countUsers,
                totalPages: (_b = objectPagination.totalPages) !== null && _b !== void 0 ? _b : 0,
            },
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
exports.list = list;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const meId = String(me._id);
        const admin = (0, user_helper_1.isAdmin)(me);
        if (!admin && meId !== id) {
            res.status(403).json({
                code: 403,
                message: "Không có quyền cập nhật người dùng này",
                data: null,
            });
            return;
        }
        const existing = yield user_model_1.default.findOne({ _id: id, deleted: false });
        if (!existing) {
            res.status(404).json({
                code: 404,
                message: "Không tìm thấy người dùng",
                data: null,
            });
            return;
        }
        const { patch, error } = yield (0, user_validate_1.buildUserEditPatch)(req, admin);
        if (error) {
            res.status(error.code).json({
                code: error.code,
                message: error.message,
                data: null,
            });
            return;
        }
        if ((patch === null || patch === void 0 ? void 0 : patch.username) !== undefined) {
            const dup = yield user_model_1.default.findOne({
                _id: { $ne: id },
                deleted: false,
                username: patch.username,
            });
            if (dup) {
                res.status(400).json({
                    code: 400,
                    message: "Tên đăng nhập đã được sử dụng",
                    data: null,
                });
                return;
            }
        }
        const updated = yield user_model_1.default.findOneAndUpdate({ _id: id, deleted: false }, { $set: patch }, { new: true, runValidators: true })
            .select("-password -token")
            .populate("roleId", "title permissions")
            .lean();
        if (!updated) {
            res.status(404).json({
                code: 404,
                message: "Không tìm thấy người dùng",
                data: null,
            });
            return;
        }
        const data = (0, user_helper_1.normalizeUserWithRole)(updated);
        res.json({
            code: 200,
            message: "Cập nhật thành công",
            data,
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
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = res.locals.user._id;
        const { data, error } = (0, user_validate_1.validatePasswordChange)(req.body);
        if (error) {
            res.status(error.code).json({
                code: error.code,
                message: error.message,
                data: null,
            });
            return;
        }
        const { oldPassword, newPassword } = data;
        const user = yield user_model_1.default.findOne({ _id: id, deleted: false }).select("+password");
        if (!user) {
            res.status(404).json({
                code: 404,
                message: "User không tồn tại!",
                data: null,
            });
            return;
        }
        if ((0, md5_1.default)(oldPassword) !== user.get("password")) {
            res.status(400).json({
                code: 400,
                message: "Mật khẩu cũ không đúng!",
                data: null,
            });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({
                code: 400,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự",
                data: null,
            });
            return;
        }
        yield user_model_1.default.updateOne({ _id: id }, { password: (0, md5_1.default)(newPassword) });
        res.json({
            code: 200,
            message: "Đổi mật khẩu thành công!",
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
exports.changePassword = changePassword;
