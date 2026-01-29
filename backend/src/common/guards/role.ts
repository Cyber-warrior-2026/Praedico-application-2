import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';

interface AuthRequest extends Request {
  user?: any;
}

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    
    // 1. Try to get token from Cookie (Preferred)
    let token = req.cookies?.accessToken;

    // 2. Fallback to Header (For Postman testing without cookies)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
      req.user = decoded;

      // 3. UNIFIED ROLE CHECK
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: Access Denied" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  };
};