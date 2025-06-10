import { Request, Response, NextFunction } from 'express';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Authentication token missing.' });
    }

    try {
        if (token === 'dummy-admin-token') {
            req.emp = { employee_id: 1, role: 1, email: 'admin@example.com' }; 
        } else if (token === 'dummy-hr-token') {
            req.emp = { employee_id: 2, role: 6, email: 'hr@example.com' };
        } else {
             return res.status(403).json({ message: 'Invalid token.' });
        }

        next(); 
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};