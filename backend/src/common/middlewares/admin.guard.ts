import { Request, Response, NextFunction } from 'express';

export const AdminGhostGuard = (req: Request, res: Response, next: NextFunction) => {
  // Check for the "Invisible Key" in headers
  const secretKey = req.headers['x-uplink-security'];
  
  // If key is missing or wrong -> Fake 404 (Ghost Mode)
  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(404).json({
      success: false,
      message: "Route not found" // Lie to the attacker
    });
  }
  
  next(); // Key matches, open the gate
};