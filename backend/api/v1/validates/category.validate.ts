import { Request } from "express";
import mongoose from "mongoose";
import Category from "../models/category.model";

type ValidationError = {
  code: number;
  message: string;
};

export const validateCategoryCreate = async (
  req: Request,
): Promise<{ data?: { title: string; slug: string }; error?: ValidationError }> => {
  const { title, slug } = req.body as {
    title?: unknown;
    slug?: unknown;
    description?: unknown;
  };

  if (typeof title !== "string" || !title.trim()) {
    return {
      error: {
        code: 400,
        message: "Vui lòng gửi title hợp lệ",
      },
    };
  }

  if (typeof slug !== "string" || !slug.trim()) {
    return {
      error: {
        code: 400,
        message: "Vui lòng gửi slug hợp lệ",
      },
    };
  }

  const trimmedTitle = title.trim();
  const trimmedSlug = slug.trim().toLowerCase();

  const existTitle = await Category.findOne({
    title: trimmedTitle,
    deleted: false,
  });
  if (existTitle) {
    return {
      error: {
        code: 400,
        message: "Tiêu đề danh mục đã tồn tại",
      },
    };
  }

  const existSlug = await Category.findOne({
    slug: trimmedSlug,
    deleted: false,
  });
  if (existSlug) {
    return {
      error: {
        code: 400,
        message: "Slug đã tồn tại",
      },
    };
  }

  return {
    data: {
      title: trimmedTitle,
      slug: trimmedSlug,
    },
  };
};

export const validateCategoryEdit = async (
  req: Request,
  id: string,
): Promise<{ data?: { title?: string; slug?: string; status?: string }; error?: ValidationError }> => {
  const { title, slug, status } = req.body as {
    title?: unknown;
    slug?: unknown;
    status?: unknown;
  };

  const update: { title?: string; slug?: string; status?: string } = {};

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
    const existTitle = await Category.findOne({
      title: trimmedTitle,
      deleted: false,
      _id: { $ne: id },
    });
    if (existTitle) {
      return {
        error: {
          code: 400,
          message: "Tiêu đề danh mục đã tồn tại",
        },
      };
    }
    update.title = trimmedTitle;
  }

  if (slug !== undefined) {
    if (typeof slug !== "string" || !slug.trim()) {
      return {
        error: {
          code: 400,
          message: "Vui lòng gửi slug hợp lệ",
        },
      };
    }
    const trimmedSlug = slug.trim().toLowerCase();
    const existSlug = await Category.findOne({
      slug: trimmedSlug,
      deleted: false,
      _id: { $ne: id },
    });
    if (existSlug) {
      return {
        error: {
          code: 400,
          message: "Slug đã tồn tại",
        },
      };
    }
    update.slug = trimmedSlug;
  }

  if (status !== undefined) {
    if (!["active", "inactive"].includes(status as string)) {
      return {
        error: {
          code: 400,
          message: "status phải là active hoặc inactive",
        },
      };
    }
    update.status = status as string;
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
