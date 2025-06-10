import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

const authService = new AuthService();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, pass } = req.body;
        const user = await authService.loginUser(email, pass);

        if (!user) {
            console.log("Credentials do not match");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { employee_id: user.employee_id, role: user.role_id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred in the server" });
    }
};