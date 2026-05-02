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
exports.upsert = exports.index = void 0;
const setting_model_1 = __importDefault(require("../models/setting.model"));
const user_helper_1 = require("../helpers/user.helper");
const setting_validate_1 = require("../validates/setting.validate");
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
        const records = yield setting_model_1.default.find({}).lean();
        const data = {};
        records.forEach((record) => {
            data[record.key] = record.value;
        });
        res.json({
            code: 200,
            message: "Success",
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
exports.index = index;
const upsert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { data, error } = (0, setting_validate_1.validateSettingUpsert)(req);
        if (error) {
            res.status(error.code).json({
                code: error.code,
                message: error.message,
                data: null,
            });
            return;
        }
        yield setting_model_1.default.updateOne({ key: data.key }, { key: data.key, value: data.value }, { upsert: true });
        res.json({
            code: 200,
            message: "Cập nhật thành công",
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
exports.upsert = upsert;
