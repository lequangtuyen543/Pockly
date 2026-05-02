import { Request, Response } from "express";
import md5 from "md5";
import User from "../models/user.model";
import * as generateHelper from "../../../helpers/generate";
import Role from "../models/role.model";

// [POST] /api/v1/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, username, password } = req.body as {
      fullName?: unknown;
      email?: unknown;
      username?: unknown;
      password?: unknown;
    };

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      !fullName.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password
    ) {
      res.status(400).json({
        code: 400,
        message: "Vui lòng gửi đầy đủ fullName, email, username và password",
      });
      return;
    }

    const existEmail = await User.findOne({
      email,
      deleted: false,
    });
    if (existEmail) {
      res.status(400).json({
        code: 400,
        message: "Email đã tồn tại!",
      });
      return;
    }

    const existUsername = await User.findOne({
      username,
      deleted: false,
    });
    if (existUsername) {
      res.status(400).json({
        code: 400,
        message: "Tên đăng nhập đã tồn tại!",
      });
      return;
    }

    let defaultRole = await Role.findOne({
      title: { $in: ["User", "user", "USER"] },
      deleted: false,
    });

    if (!defaultRole) {
      defaultRole = await Role.findOne({ deleted: false });
    }

    if (!defaultRole) {
      defaultRole = await new Role({
        title: "User",
        description: "Default user role",
        permissions: [],
      }).save();
    }

    const user = new User({
      fullName: fullName.trim(),
      email: email.trim(),
      username: username.trim(),
      password: md5(password),
      token: generateHelper.generateRandomString(20),
      roleId: defaultRole._id,
    });

    await user.save();

    const token = user.get("token");
    res.cookie("token", token, { httpOnly: true });

    res.json({
      code: 200,
      message: "Đăng ký thành công!",
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({
      code: 500,
      message,
    });
  }
};

// [POST] /api/v1/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as {
      username?: unknown;
      password?: unknown;
    };

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({
        code: 400,
        message: "Vui lòng gửi username và password",
      });
      return;
    }

    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ],
      deleted: false,
    }).select("+password");

    if (!user) {
      res.status(400).json({
        code: 400,
        message: "Tài khoản không tồn tại!",
      });
      return;
    }

    if (md5(password) !== user.get("password")) {
      res.status(400).json({
        code: 400,
        message: "Sai mật khẩu!",
      });
      return;
    }

    const token = user.get("token");
    res.cookie("token", token, { httpOnly: true });

    const safeUser = user.toObject() as Record<string, unknown>;
    delete safeUser.password;

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      token,
      user: safeUser,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({
      code: 500,
      message,
    });
  }
};

