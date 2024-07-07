import { NextFunction, Request, Response } from "express";
import { CustomError } from "../interfaces/CustomError";
import { date } from "joi";

export const globalErrorResponse = () => {
  return (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const statusCode = error.statusCode || 500;
    if (error instanceof CustomError) {
      res.status(statusCode).json({
        message: error.errorMessage,
        data: error.data,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error." });
    }
  };
};
