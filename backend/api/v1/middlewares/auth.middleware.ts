import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Role from "../models/role.model";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.headers.authorization) {
      res.json({
        code: 400,
        message: "Vui lòng gửi kèm token!",
      });
      return;
    }

    const tokenParts = req.headers.authorization.split(" ");
    if (tokenParts.length !== 2 || !tokenParts[1]) {
      res.json({
        code: 400,
        message: "token không hợp lệ!",
      });
      return;
    }

    const token: string = tokenParts[1];
    const user = await User.findOne({
      token,
      deleted: false,
    })
      .select("-password")
      .lean();

    if (!user) {
      res.json({
        code: 400,
        message: "token không hợp lệ!",
      });
      return;
    }

    const roleInfo = await Role.findOne({
      _id: user.roleId,
    })
      .select("title permissions")
      .lean();

    if (roleInfo) {
      (user as any)["role"] = roleInfo;
    }

    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
