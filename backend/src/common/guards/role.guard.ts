import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';

interface AuthRequest extends Request {
  user?: any;
}

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
      // 2. Verify Token
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
      req.user = decoded;

      // 3. Check Role (The RBAC Magic)
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: You do not have permission" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  };
};