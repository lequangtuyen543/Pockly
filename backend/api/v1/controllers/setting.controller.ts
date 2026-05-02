import { Request, Response } from "express";
import Setting from "../models/setting.model";
import { isAdmin, LocalUser } from "../helpers/user.helper";
import { validateSettingUpsert } from "../validates/setting.validate";

// [GET] /api/v1/settings (Admin)
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

    const records = await Setting.find({}).lean();

    // Convert array to object format
    const data: Record<string, string> = {};
    records.forEach((record) => {
      data[record.key] = record.value;
    });

    res.json({
      code: 200,
      message: "Success",
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

// [PATCH] /api/v1/settings (Admin)
export const upsert = async (req: Request, res: Response): Promise<void> => {
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

    const { data, error } = validateSettingUpsert(req);
    if (error) {
      res.status(error.code).json({
        code: error.code,
        message: error.message,
        data: null,
      });
      return;
    }

    const updatePromises = Object.entries(data!).map(([key, value]) => {
      return Setting.updateOne(
        { key },
        { key, value },
        { upsert: true }
      );
    });

    await Promise.all(updatePromises);

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

