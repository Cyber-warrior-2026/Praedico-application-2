import { Request, Response, NextFunction } from 'express';

export const AdminGhostGuard = (req: Request, res: Response, next: NextFunction) => {

  const secretKey = req.headers['x-uplink-security'];
  

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(404).json({
      success: false,
      message: "Route not found" 
    });
  }
  
  next();
};