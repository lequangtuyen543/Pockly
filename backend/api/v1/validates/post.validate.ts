import { Request } from "express";
import mongoose from "mongoose";
import Category from "../models/category.model";

type ValidationError = {
  code: number;
  message: string;
};

export const validatePostCreate = async (
  req: Request,
): Promise<{
  data?: { title: string; content: string; thumbnail: string; categoryId: string };
  error?: ValidationError;
}> => {
  const { title, content, thumbnail, categoryId } = req.body as {
    title?: unknown;
    content?: unknown;
    thumbnail?: unknown;
    categoryId?: unknown;
  };

  if (typeof title !== "string" || !title.trim()) {
    return {
      error: {
        code: 400,
        message: "Vui lòng gửi title hợp lệ",
      },
    };
  }

  if (typeof content !== "string" || !content.trim()) {
    return {
      error: {
        code: 400,
        message: "Vui lòng gửi content hợp lệ",
      },
    };
  }

  if (typeof categoryId !== "string" || !mongoose.Types.ObjectId.isValid(categoryId)) {
    return {
      error: {
        code: 400,
        message: "categoryId không hợp lệ",
      },
    };
  }

  const category = await Category.findOne({
    _id: categoryId,
    deleted: false,
    status: "active",
  });
  if (!category) {
    return {
      error: {
        code: 400,
        message: "Danh mục không tồn tại hoặc không khả dụng",
      },
    };
  }

  return {
    data: {
      title: title.trim(),
      content: content.trim(),
      thumbnail: typeof thumbnail === "string" ? thumbnail : "",
      categoryId,
    },
  };
};

export const validatePostEdit = async (
  req: Request,
  isAdmin: boolean,
): Promise<{
  data?: { title?: string; content?: string; thumbnail?: string; categoryId?: string; status?: string };
  error?: ValidationError;
}> => {
  const { title, content, thumbnail, categoryId, status } = req.body as {
    title?: unknown;
    content?: unknown;
    thumbnail?: unknown;
    categoryId?: unknown;
    status?: unknown;
  };

  // Check if user (non-admin) tries to update status
  if (!isAdmin && status !== undefined) {
    return {
      error: {
        code: 403,
        message: "Chỉ admin mới được cập nhật status",
      },
    };
  }

  const patch: { title?: string; content?: string; thumbnail?: string; categoryId?: string; status?: string } = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return {
        error: {
          code: 400,
          message: "Vui lòng gửi title hợp lệ",
        },
      };
    }
    patch.title = title.trim();
  }

  if (content !== undefined) {
    if (typeof content !== "string" || !content.trim()) {
      return {
        error: {
          code: 400,
          message: "Vui lòng gửi content hợp lệ",
        },
      };
    }
    patch.content = content.trim();
  }

  if (thumbnail !== undefined) {
    patch.thumbnail = typeof thumbnail === "string" ? thumbnail : "";
  }

  if (categoryId !== undefined) {
    const cid = String(categoryId);
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return {
        error: {
          code: 400,
          message: "categoryId không hợp lệ",
        },
      };
    }
    const category = await Category.findOne({
      _id: cid,
      deleted: false,
      status: "active",
    });
    if (!category) {
      return {
        error: {
          code: 400,
          message: "Danh mục không tồn tại hoặc không khả dụng",
        },
      };
    }
    patch.categoryId = cid;
  }

  if (isAdmin && status !== undefined) {
    if (!["active", "inactive"].includes(status as string)) {
      return {
        error: {
          code: 400,
          message: "status phải là active hoặc inactive",
        },
      };
    }
    patch.status = status as string;
  }

  if (Object.keys(patch).length === 0) {
    return {
      error: {
        code: 400,
        message: "Không có dữ liệu hợp lệ để cập nhật",
      },
    };
  }

  return { data: patch };
};
