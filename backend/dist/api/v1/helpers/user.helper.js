"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamId = exports.normalizeUserWithRole = exports.isPopulatedRole = exports.isAdmin = void 0;
const isAdmin = (user) => {
    var _a, _b, _c, _d;
    const title = (_b = (_a = user.role) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    if (title === "admin")
        return true;
    const perms = (_d = (_c = user.role) === null || _c === void 0 ? void 0 : _c.permissions) !== null && _d !== void 0 ? _d : [];
    return perms.some((p) => p.toLowerCase() === "admin" || p === "manage_users");
};
exports.isAdmin = isAdmin;
const isPopulatedRole = (roleId) => Boolean(roleId &&
    typeof roleId === "object" &&
    roleId !== null &&
    "title" in roleId);
exports.isPopulatedRole = isPopulatedRole;
const normalizeUserWithRole = (doc) => {
    const { roleId } = doc, rest = __rest(doc, ["roleId"]);
    if ((0, exports.isPopulatedRole)(roleId)) {
        return Object.assign(Object.assign({}, rest), { role: roleId, roleId: roleId._id });
    }
    return Object.assign(Object.assign({}, rest), { role: null, roleId });
};
exports.normalizeUserWithRole = normalizeUserWithRole;
const getParamId = (req) => {
    const raw = req.params.id;
    return Array.isArray(raw) ? raw[0] : raw;
};
exports.getParamId = getParamId;
