import { NextFunction, Request, Response } from "express";

export const errorHanlderMiddleware = (API: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await API(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
