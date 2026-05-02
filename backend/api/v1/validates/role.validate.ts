import { Request } from "express";
import mongoose from "mongoose";
import Role from "../models/role.model";

type ValidationError = {
  code: number;
  message: string;
};

export const validateRoleCreate = async (
  req: Request,
): Promise<{ data?: { title: string; description: string; permissions: string[] }; error?: ValidationError }> => {
  const { title, description, permissions } = req.body as {
    title?: unknown;
    description?: unknown;
    permissions?: unknown;
  };

  if (typeof title !== "string" || !title.trim()) {
    return {
      error: {
        code: 400,
        message: "Vui lòng gửi title hợp lệ",
      },
    };
  }

  const trimmedTitle = title.trim();
  const existing = await Role.findOne({
    title: trimmedTitle,
    deleted: false,
  });
  if (existing) {
    return {
      error: {
        code: 400,
        message: "Tên vai trò đã tồn tại",
      },
    };
  }

  const desc = typeof description === "string" ? description.trim() : "";
  const perms = Array.isArray(permissions) ? permissions.filter((p) => typeof p === "string") : [];

  return {
    data: {
      title: trimmedTitle,
      description: desc,
      permissions: perms,
    },
  };
};

export const validateRoleEdit = async (
  req: Request,
  id: string,
): Promise<{ data?: { title?: string; description?: string; permissions?: string[] }; error?: ValidationError }> => {
  const { title, description, permissions } = req.body as {
    title?: unknown;
    description?: unknown;
    permissions?: unknown;
  };

  const update: { title?: string; description?: string; permissions?: string[] } = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return {
        error: {
          code: 400,
          message: "Vui lòng gửi title hợp lệ",
        },
      };
    }
    const trimmedTitle = title.trim();
    const existing = await Role.findOne({
      title: trimmedTitle,
      deleted: false,
      _id: { $ne: id },
    });
    if (existing) {
      return {
        error: {
          code: 400,
          message: "Tên vai trò đã tồn tại",
        },
      };
    }
    update.title = trimmedTitle;
  }

  if (description !== undefined) {
    update.description = typeof description === "string" ? description.trim() : "";
  }

  if (permissions !== undefined) {
    if (!Array.isArray(permissions)) {
      return {
        error: {
          code: 400,
          message: "permissions phải là mảng",
        },
      };
    }
    update.permissions = permissions.filter((p) => typeof p === "string");
  }

  if (Object.keys(update).length === 0) {
    return {
      error: {
        code: 400,
        message: "Không có dữ liệu hợp lệ để cập nhật",
      },
    };
  }

  return { data: update };
};