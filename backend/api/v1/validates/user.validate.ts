import { Request } from "express";
import mongoose from "mongoose";
import Role from "../models/role.model";

type ValidationError = {
  code: number;
  message: string;
};

export const buildUserEditPatch = async (
  req: Request,
  admin: boolean,
): Promise<{ patch?: Record<string, unknown>; error?: ValidationError }> => {
  if (!admin && (req.body.roleId !== undefined || req.body.status !== undefined)) {
    return {
      error: {
        code: 403,
        message: "Chỉ admin mới được cập nhật roleId hoặc status",
      },
    };
  }

  const patch: Record<string, unknown> = {};
  if (typeof req.body.username === "string") {
    patch.username = req.body.username.trim();
  }
  if (typeof req.body.avatar === "string") {
    patch.avatar = req.body.avatar;
  }
  if (typeof req.body.fullName === "string") {
    patch.fullName = req.body.fullName.trim();
  }
  if (admin && typeof req.body.email === "string") {
    patch.email = req.body.email.trim();
  }

  if (admin && req.body.roleId !== undefined) {
    const roleId = String(req.body.roleId);
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return {
        error: {
          code: 400,
          message: "roleId không hợp lệ",
        },
      };
    }

    const role = await Role.findOne({
      _id: roleId,
      deleted: false,
    });
    if (!role) {
      return {
        error: {
          code: 400,
          message: "Vai trò không tồn tại",
        },
      };
    }

    patch.roleId = role._id;
  }

  if (admin && req.body.status !== undefined) {
    if (!["active", "inactive"].includes(req.body.status)) {
      return {
        error: {
          code: 400,
          message: "status phải là active hoặc inactive",
        },
      };
    }
    patch.status = req.body.status;
  }

  if (Object.keys(patch).length === 0) {
    return {
      error: {
        code: 400,
        message: "Không có dữ liệu hợp lệ để cập nhật",
      },
    };
  }

  return { patch };
};

export const validatePasswordChange = (
  payload: unknown,
): { data?: { oldPassword: string; newPassword: string }; error?: ValidationError } => {
  const body = payload as {
    oldPassword?: unknown;
    newPassword?: unknown;
  };

  const oldPassword = typeof body.oldPassword === "string" ? body.oldPassword : undefined;
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : undefined;

  if (!oldPassword || !newPassword) {
    return {
      error: {
        code: 400,
        message: "Vui lòng gửi oldPassword và newPassword",
      },
    };
  }

  if (newPassword.length < 6) {
    return {
      error: {
        code: 400,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      },
    };
  }

  return {
    data: {
      oldPassword,
      newPassword,
    },
  };
};
