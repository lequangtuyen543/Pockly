"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerOrAdmin = void 0;
const ownerOrAdmin = (postUserId, me) => {
    var _a, _b, _c, _d;
    const title = (_b = (_a = me.role) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    const isAdmin = title === "admin" || ((_d = (_c = me.role) === null || _c === void 0 ? void 0 : _c.permissions) !== null && _d !== void 0 ? _d : []).some((p) => p.toLowerCase() === "admin" || p === "manage_users");
    if (isAdmin)
        return true;
    const uid = postUserId &&
        typeof postUserId === "object" &&
        postUserId !== null &&
        "_id" in postUserId
        ? String(postUserId._id)
        : String(postUserId);
    return uid === String(me._id);
};
exports.ownerOrAdmin = ownerOrAdmin;
