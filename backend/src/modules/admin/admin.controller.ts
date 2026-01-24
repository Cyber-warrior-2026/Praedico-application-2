import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { z } from 'zod';

// Validation Schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginAdmin = async (req: Request, res: Response) => {
  try {

    const { email, password } = loginSchema.parse(req.body);


    const token = await AdminService.login(email, password);


    res.status(200).json({ success: true, token });

  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const createFirstAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    await AdminService.createAdmin(email, password);
    res.status(201).json({ success: true, message: "Admin Created" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};