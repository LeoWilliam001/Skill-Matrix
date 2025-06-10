import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            emp?: { 
                employee_id: number;
                role: number;
                email: string;
            };
        }
    }
}