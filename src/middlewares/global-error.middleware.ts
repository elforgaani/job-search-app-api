import { NextFunction, Request, Response } from "express";
import { Error } from "../interfaces/Error";

export const globalErrorMiddleware = () => {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.errorMessage });
    }
    res.status(500).json({ success: false, message: "Internal Server Error." });
  };
};
