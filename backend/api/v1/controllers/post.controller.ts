import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/post.model";
import searchHelper from "../../../helpers/search";
import paginationHelper from "../../../helpers/pagination";
import { isAdmin, LocalUser, getParamId } from "../helpers/user.helper";
import { ownerOrAdmin } from "../helpers/post.helper";
import {
  validatePostCreate,
  validatePostEdit,
} from "../validates/post.validate";

// [GET] /api/v1/posts
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const find: Record<string, unknown> = {
      deleted: false,
      status: "active",
    };

    if (req.query.categoryId) {
      const cid = req.query.categoryId.toString();
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.status(400).json({
          code: 400,
          message: "categoryId không hợp lệ",
          data: null,
        });
        return;
      }
      find.categoryId = cid;
    }

    const objectSearch = searchHelper(req.query);
    if (req.query.keyword && objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    const initPagination = {
      currentPage: 1,
      limitItems: 5,
    };

    const countPosts = await Post.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countPosts,
    );

    const allowedSortKeys = new Set(["title", "createdAt"]);
    let sortKey = "createdAt";
    if (req.query.sortKey) {
      const k = req.query.sortKey.toString();
      if (allowedSortKeys.has(k)) sortKey = k;
    }
    const sortDir =
      req.query.sortValue?.toString().toLowerCase() === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortKey]: sortDir };

    const posts = await Post.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip ?? 0)
      .populate("userId", "username")
      .populate("categoryId", "title slug")
      .lean();

    res.json({
      code: 200,
      message: "Success",
      data: posts,
      pagination: {
        currentPage: objectPagination.currentPage,
        limitItems: objectPagination.limitItems,
        totalItems: countPosts,
        totalPages: objectPagination.totalPages ?? 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    res.status(500).json({
      code: 500,
      message,
      data: null,
    });
  }
};

// [GET] /api/v1/posts/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const id = getParamId(req);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      code: 400,
      message: "Id không hợp lệ",
      data: null,
    });
    return;
  }

  const post = await Post.findOne({
    _id: id,
    deleted: false,
    status: "active",
  })
    .populate("userId", "username")
    .populate("categoryId", "title")
    .lean();

  if (!post) {
    res.status(404).json({
      code: 404,
      message: "Không tìm thấy bài viết",
      data: null,
    });
    return;
  }

  const doc = post as Record<string, unknown> & {
    userId?: { _id: mongoose.Types.ObjectId; username?: string };
    categoryId?: { _id: mongoose.Types.ObjectId; title?: string };
  };

  const { userId, categoryId, ...rest } = doc;

  res.json({
    code: 200,
    message: "Success",
    data: {
      ...rest,
      user: userId
        ? { _id: userId._id, username: userId.username ?? "" }
        : null,
      category: categoryId
        ? { _id: categoryId._id, title: categoryId.title ?? "" }
        : null,
    },
  });
};

// [POST] /api/v1/posts/create
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const me = res.locals.user as LocalUser;
    
    const { data, error } = await validatePostCreate(req);
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    const record = new Post({
      title: data!.title,
      content: data!.content,
      thumbnail: data!.thumbnail,
      categoryId: data!.categoryId,
      userId: me._id,
      status: "active",
      deleted: false,
    });

    const saved = await record.save();
    const populated = await Post.findById(saved._id)
      .populate("userId", "username")
      .populate("categoryId", "title")
      .lean();

    const p = populated as Record<string, unknown> & {
      userId?: { _id: mongoose.Types.ObjectId; username?: string };
      categoryId?: { _id: mongoose.Types.ObjectId; title?: string };
    } | null;

    if (!p) {
      res.json({
        code: 200,
        message: "Tạo thành công!",
        data: saved,
      });
      return;
    }

    const { userId, categoryId: cat, ...rest } = p;

    res.json({
      code: 200,
      message: "Tạo thành công!",
      data: {
        ...rest,
        user: userId
          ? { _id: userId._id, username: userId.username ?? "" }
          : null,
        category: cat
          ? { _id: cat._id, title: cat.title ?? "" }
          : null,
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

// [PATCH] /api/v1/posts/edit/:id
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
    const post = await Post.findOne({ _id: id, deleted: false });

    if (!post) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết",
        data: null,
      });
      return;
    }

    if (!ownerOrAdmin(post.userId, me)) {
      res.status(403).json({
        code: 403,
        message: "Không có quyền chỉnh sửa bài viết này",
        data: null,
      });
      return;
    }

    const { data, error } = await validatePostEdit(req, isAdmin(me));
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    const updated = await Post.findOneAndUpdate(
      { _id: id, deleted: false },
      { $set: data },
      { new: true, runValidators: true },
    )
      .populate("userId", "username")
      .populate("categoryId", "title")
      .lean();

    if (!updated) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết",
        data: null,
      });
      return;
    }

    const doc = updated as Record<string, unknown> & {
      userId?: { _id: mongoose.Types.ObjectId; username?: string };
      categoryId?: { _id: mongoose.Types.ObjectId; title?: string };
    };
    const { userId, categoryId, ...rest } = doc;

    res.json({
      code: 200,
      message: "Cập nhật thành công!",
      data: {
        ...rest,
        user: userId
          ? { _id: userId._id, username: userId.username ?? "" }
          : null,
        category: categoryId
          ? { _id: categoryId._id, title: categoryId.title ?? "" }
          : null,
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

// [DELETE] /api/v1/posts/delete/:id
export const deletePost = async (req: Request, res: Response): Promise<void> => {
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
    const post = await Post.findOne({ _id: id, deleted: false });

    if (!post) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết",
        data: null,
      });
      return;
    }

    if (!ownerOrAdmin(post.userId, me)) {
      res.status(403).json({
        code: 403,
        message: "Không có quyền xóa bài viết này",
        data: null,
      });
      return;
    }

    await Post.updateOne({ _id: id }, { $set: { deleted: true } });

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
