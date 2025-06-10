import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Authentication token missing.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { employee_id: number; role: number; email: string };

        req.emp = {
            employee_id: decoded.employee_id,
            role: decoded.role,
            email: decoded.email,
        };

        next(); 
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

export const authorizeRoles = (roles: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.emp || !roles.includes(req.emp.role)) {
            res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            return;
        }
        next();
    };
};