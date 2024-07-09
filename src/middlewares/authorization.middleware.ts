import { NextFunction, Request, Response } from "express";
import { AppRoles } from "../types/roles.types";
import { CustomError } from "../interfaces/CustomError";

export const authorizationMiddleware = (role: AppRoles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    if (Array.isArray(role)) {
      if (!role.includes(user.role)) {
        return next(new CustomError(false, 403, "You're not Authorized"));
      }
    } else {
      if (user.role !== role) {
        return next(new CustomError(false, 403, "You're not Authorized"));
      }
    }
    next();
  };
};
