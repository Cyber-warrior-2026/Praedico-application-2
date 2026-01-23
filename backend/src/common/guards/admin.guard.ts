import { Request, Response, NextFunction } from "express";
import { ENV } from "../../config/env";

export const AdminGhostGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secretKey = req.headers["x-uplink-security"];

  if (secretKey !== ENV.ADMIN_SECRET_KEY) {
    return res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }

  next();
};
