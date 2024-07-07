import { NextFunction, Request, RequestHandler, Response } from "express";
import { ValidationSchema } from "../interfaces/ValidationSchema";
import { CustomError } from "../interfaces/CustomError";

type ReqKey = keyof ValidationSchema;

export const validationMiddleware = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const reqKeys: ReqKey[] = ["body", "params", "query"];
    for (const key of reqKeys) {
      let result = schema[key]?.validate(req[key], {
        abortEarly: false,
      });
      if (result?.error) {
        const { error: validationError } = result;
        const errors = validationError.details.map((e) => e.message);
        next(new CustomError("Error While Parsing Body", 400, errors));
      }
    }
    next();
  };
};
