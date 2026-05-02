import { Request, Response } from "express";
import mongoose from "mongoose";
import md5 from "md5";
import User from "../models/user.model";
import searchHelper from "../../../helpers/search";
import paginationHelper from "../../../helpers/pagination";
import {
  getParamId,
  isAdmin,
  LocalUser,
  normalizeUserWithRole,
} from "../helpers/user.helper";
import {
  buildUserEditPatch,
  validatePasswordChange,
} from "../validates/user.validate";

// [GET] /api/v1/users/info
export const info = async (req: Request, res: Response): Promise<void> => {
  const raw = res.locals.user as Record<string, unknown>;
  const safe: Record<string, unknown> = { ...raw };
  delete safe.password;
  delete safe.token;

  res.json({
    code: 200,
    message: "Thành công",
    data: safe,
  });
};

// [GET] /api/v1/users (Admin)
export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const me = res.locals.user as LocalUser;
    if (!isAdmin(me)) {
      res.status(403).json({
        code: 403,
        message: "Không có quyền truy cập",
        data: null,
      });
      return;
    }

    const find: Record<string, unknown> = {
      deleted: false,
    };

    if (req.query.keyword) {
      const objectSearch = searchHelper(req.query);
      if (objectSearch.regex) {
        find.$or = [
          { username: objectSearch.regex },
          { email: objectSearch.regex },
        ];
      }
    }

    const initPagination = {
      currentPage: 1,
      limitItems: 10,
    };

    const countUsers = await User.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countUsers,
    );

    const sort: Record<string, 1 | -1> = { createdAt: -1 };

    const users = await User.find(find)
      .select("-password -token")
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip ?? 0)
      .populate("roleId", "title permissions")
      .lean();

    const data = users.map((u) => normalizeUserWithRole(u as Record<string, unknown> & { roleId?: unknown }));

    res.json({
      code: 200,
      message: "Success",
      data,
      pagination: {
        currentPage: objectPagination.currentPage,
        limitItems: objectPagination.limitItems,
        totalItems: countUsers,
        totalPages: objectPagination.totalPages ?? 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi!";
    res.status(500).json({
      code: 500,
      message,
      data: null,
    });
  }
};

// [PATCH] /api/v1/users/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getParamId(req);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        code: 400,
        message: "Id không hợp lệ",
        data: null,
      });
      return;
    }

    const me = res.locals.user as LocalUser;
    const meId = String(me._id);
    const admin = isAdmin(me);

    if (!admin && meId !== id) {
      res.status(403).json({
        code: 403,
        message: "Không có quyền cập nhật người dùng này",
        data: null,
      });
      return;
    }

    const existing = await User.findOne({ _id: id, deleted: false });
    if (!existing) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy người dùng",
        data: null,
      });
      return;
    }

    const { patch, error } = await buildUserEditPatch(req, admin);
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    if (patch?.username !== undefined) {
      const dup = await User.findOne({
        _id: { $ne: id },
        deleted: false,
        username: patch.username,
      });
      if (dup) {
        res.status(400).json({
          code: 400,
          message: "Tên đăng nhập đã được sử dụng",
          data: null,
        });
        return;
      }
    }

    const updated = await User.findOneAndUpdate(
      { _id: id, deleted: false },
      { $set: patch },
      { new: true, runValidators: true },
    )
      .select("-password -token")
      .populate("roleId", "title permissions")
      .lean();

    if (!updated) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy người dùng",
        data: null,
      });
      return;
    }

    const data = normalizeUserWithRole(updated as Record<string, unknown> & { roleId?: unknown });
    res.json({
      code: 200,
      message: "Cập nhật thành công",
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi!";
    res.status(500).json({
      code: 500,
      message,
      data: null,
    });
  }
};

// [PATCH] /api/v1/users/change-password
export const changePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = (res.locals.user as LocalUser)._id;
    const { data, error } = validatePasswordChange(req.body);
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    const { oldPassword, newPassword } = data!;
    const user = await User.findOne({ _id: id, deleted: false }).select(
      "+password",
    );

    if (!user) {
      res.status(404).json({
        code: 404,
        message: "User không tồn tại!",
        data: null,
      });
      return;
    }

    if (md5(oldPassword) !== user.get("password")) {
      res.status(400).json({
        code: 400,
        message: "Mật khẩu cũ không đúng!",
        data: null,
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        code: 400,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
        data: null,
      });
      return;
    }

    await User.updateOne(
      { _id: id },
      { password: md5(newPassword) },
    );

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công!",
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi!";
    res.status(500).json({
      code: 500,
      message,
      data: null,
    });
  }
};
