import { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../models/category.model";
import { isAdmin, LocalUser, getParamId } from "../helpers/user.helper";
import searchHelper from "../../../helpers/search";
import paginationHelper from "../../../helpers/pagination";
import {
  validateCategoryCreate,
  validateCategoryEdit,
} from "../validates/category.validate";

// [GET] /api/v1/categories
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const find: Record<string, unknown> = {
      deleted: false,
    };

    if (req.query.keyword) {
      const objectSearch = searchHelper(req.query);
      if (objectSearch.regex) {
        find.title = objectSearch.regex;
      }
    }

    const initPagination = {
      currentPage: 1,
      limitItems: 10,
    };

    const countCategories = await Category.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countCategories,
    );

    const records = await Category.find(find)
      .sort({ createdAt: -1 })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip ?? 0)
      .lean();

    res.json({
      code: 200,
      message: "Success",
      data: records,
      pagination: {
        currentPage: objectPagination.currentPage,
        limitItems: objectPagination.limitItems,
        totalItems: countCategories,
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

// [POST] /api/v1/categories (Admin)
export const create = async (req: Request, res: Response): Promise<void> => {
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

    const { data, error } = await validateCategoryCreate(req);
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    const record = new Category(data);
    const saved = await record.save();

    res.json({
      code: 200,
      message: "Tạo danh mục thành công",
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

// [PATCH] /api/v1/categories/:id (Admin)
export const edit = async (req: Request, res: Response): Promise<void> => {
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

    const existing = await Category.findOne({ _id: id, deleted: false });
    if (!existing) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy danh mục",
        data: null,
      });
      return;
    }

    const { data, error } = await validateCategoryEdit(req, id);
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    await Category.updateOne({ _id: id }, data!);

    res.json({
      code: 200,
      message: "Cập nhật thành công",
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

// [DELETE] /api/v1/categories/:id (Admin, soft delete)
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

    const existing = await Category.findOne({ _id: id, deleted: false });
    if (!existing) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy danh mục",
        data: null,
      });
      return;
    }

    await Category.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    res.json({
      code: 200,
      message: "Xóa thành công",
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

