"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSettingUpsert = void 0;
const validateSettingUpsert = (req) => {
    const { key, value } = req.body;
    if (typeof key !== "string" || !key.trim()) {
        return {
            error: {
                code: 400,
                message: "Vui lòng gửi key hợp lệ",
            },
        };
    }
    const trimmedKey = key.trim();
    const val = typeof value === "string" ? value : "";
    return {
        data: {
            key: trimmedKey,
            value: val,
        },
    };
};
exports.validateSettingUpsert = validateSettingUpsert;
