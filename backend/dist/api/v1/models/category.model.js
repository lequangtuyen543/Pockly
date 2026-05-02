"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    deleted: {
        type: Boolean,
        default: false,
        index: true,
    },
}, { timestamps: true });
const Category = mongoose_1.default.model("Category", categorySchema, "categories");
exports.default = Category;
