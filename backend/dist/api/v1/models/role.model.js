"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roleSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    permissions: {
        type: [String],
        default: [],
    },
    deleted: {
        type: Boolean,
        default: false,
        index: true,
    },
}, { timestamps: true });
const Role = mongoose_1.default.model("Role", roleSchema, "roles");
exports.default = Role;
