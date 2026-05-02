import mongoose from "mongoose";
import { Request } from "express";

export type LocalUser = {
  _id: mongoose.Types.ObjectId;
  role?: { title?: string; permissions?: string[] } | null;
};

export const isAdmin = (user: LocalUser): boolean => {
  const title = user.role?.title?.toLowerCase();
  if (title === "admin") return true;
  const perms = user.role?.permissions ?? [];
  return perms.some(
    (p) => p.toLowerCase() === "admin" || p === "manage_users",
  );
};

export const isPopulatedRole = (
  roleId: unknown,
): roleId is { _id: mongoose.Types.ObjectId; title?: string; permissions?: string[] } =>
  Boolean(
    roleId &&
      typeof roleId === "object" &&
      roleId !== null &&
      "title" in roleId,
  );

export const normalizeUserWithRole = (
  doc: Record<string, unknown> & { roleId?: unknown },
): Record<string, unknown> => {
  const { roleId, ...rest } = doc;
  if (isPopulatedRole(roleId)) {
    return { ...rest, role: roleId, roleId: roleId._id };
  }
  return { ...rest, role: null, roleId };
};

export const getParamId = (req: Request): string | undefined => {
  const raw = req.params.id;
  return Array.isArray(raw) ? raw[0] : raw;
};
