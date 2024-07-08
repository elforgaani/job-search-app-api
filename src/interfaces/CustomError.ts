// customError.ts

export class CustomError extends Error {
  statusCode?: number;
  errorMessage: string;
  data?: any;
  success?: boolean;

  constructor(success: boolean, statusCode: number, errorMessage: string, data?: any,) {
    super(errorMessage);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
    this.data = data;
    this.success = success
    // Maintains proper stack trace for where the error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
