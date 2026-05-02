import { Request, Response } from "express";
import mongoose from "mongoose";
import Role from "../models/role.model";
import { isAdmin, LocalUser, getParamId } from "../helpers/user.helper";
import { validateRoleCreate, validateRoleEdit } from "../validates/role.validate";

// [GET] /api/v1/roles (Admin)
export const index = async (req: Request, res: Response): Promise<void> => {
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

    const records = await Role.find({ deleted: false }).sort({ createdAt: -1 });

    res.json({
      code: 200,
      message: "Thành công!",
      data: records,
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

// [POST] /api/v1/roles (Admin)
export const createRecord = async (req: Request, res: Response): Promise<void> => {
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

    const { data, error } = await validateRoleCreate(req);
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    const record = new Role(data);
    const saved = await record.save();

    res.json({
      code: 200,
      message: "Tạo thành công!",
      data: saved,
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

// [PATCH] /api/v1/roles/:id (Admin)
export const editRecord = async (req: Request, res: Response): Promise<void> => {
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

    const id = getParamId(req);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        code: 400,
        message: "Id không hợp lệ",
        data: null,
      });
      return;
    }

    const existing = await Role.findOne({ _id: id, deleted: false });
    if (!existing) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy vai trò",
        data: null,
      });
      return;
    }

    const { data, error } = await validateRoleEdit(req, id);
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    await Role.updateOne({ _id: id }, data!);

    res.json({
      code: 200,
      message: "Cập nhật thành công!",
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

// [DELETE] /api/v1/roles/:id (Admin)
export const deleteRecord = async (req: Request, res: Response): Promise<void> => {
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

    const id = getParamId(req);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        code: 400,
        message: "Id không hợp lệ",
        data: null,
      });
      return;
    }

    const existing = await Role.findOne({ _id: id, deleted: false });
    if (!existing) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy vai trò",
        data: null,
      });
      return;
    }

    await Role.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.json({
      code: 200,
      message: "Xóa thành công!",
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
