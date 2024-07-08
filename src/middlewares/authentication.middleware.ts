import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomError } from "../interfaces/CustomError";
import jwt from 'jsonwebtoken';

export const authenticationMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (!authorization) {
        return next(new CustomError(false, 401, "Token is required."));
    }
    const token = authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        req.user = decoded as User
        next();
    } catch (error) {
        next(new CustomError(false, 401, "Access Denied."));
    }
}