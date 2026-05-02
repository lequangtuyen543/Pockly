import { Request } from "express";

type ValidationError = {
  code: number;
  message: string;
};

export const validateSettingUpsert = (
  req: Request,
): { data?: Record<string, string>; error?: ValidationError } => {
  const body = req.body as Record<string, unknown>;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      error: {
        code: 400,
        message: "Dữ liệu không hợp lệ",
      },
    };
  }

  const validatedData: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(body)) {
    if (typeof key === "string" && key.trim()) {
      validatedData[key.trim()] = typeof value === "string" ? value : String(value || "");
    }
  }

  return {
    data: validatedData,
  };
};
