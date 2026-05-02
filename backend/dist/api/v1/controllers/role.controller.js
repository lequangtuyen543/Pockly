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
exports.deleteRecord = exports.editRecord = exports.createRecord = exports.index = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const role_model_1 = __importDefault(require("../models/role.model"));
const user_helper_1 = require("../helpers/user.helper");
const role_validate_1 = require("../validates/role.validate");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const records = yield role_model_1.default.find({ deleted: false }).sort({ createdAt: -1 });
        res.json({
            code: 200,
            message: "Thành công!",
            data: records,
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
exports.index = index;
const createRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { data, error } = yield (0, role_validate_1.validateRoleCreate)(req);
        if (error) {
            res.status(error.code).json({
                code: error.code,
                message: error.message,
                data: null,
            });
            return;
        }
        const record = new role_model_1.default(data);
        const saved = yield record.save();
        res.json({
            code: 200,
            message: "Tạo thành công!",
            data: saved,
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
exports.createRecord = createRecord;
const editRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const id = (0, user_helper_1.getParamId)(req);
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                code: 400,
                message: "Id không hợp lệ",
                data: null,
            });
            return;
        }
        const existing = yield role_model_1.default.findOne({ _id: id, deleted: false });
        if (!existing) {
            res.status(404).json({
                code: 404,
                message: "Không tìm thấy vai trò",
                data: null,
            });
            return;
        }
        const { data, error } = yield (0, role_validate_1.validateRoleEdit)(req, id);
        if (error) {
            res.status(error.code).json({
                code: error.code,
                message: error.message,
                data: null,
            });
            return;
        }
        yield role_model_1.default.updateOne({ _id: id }, data);
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
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
exports.editRecord = editRecord;
const deleteRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const id = (0, user_helper_1.getParamId)(req);
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                code: 400,
                message: "Id không hợp lệ",
                data: null,
            });
            return;
        }
        const existing = yield role_model_1.default.findOne({ _id: id, deleted: false });
        if (!existing) {
            res.status(404).json({
                code: 404,
                message: "Không tìm thấy vai trò",
                data: null,
            });
            return;
        }
        yield role_model_1.default.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date(),
        });
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
exports.deleteRecord = deleteRecord;
