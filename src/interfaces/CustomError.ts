// customError.ts

export class CustomError extends Error {
  statusCode?: number;
  errorMessage: string;
  data?: any;

  constructor(errorMessage: string, statusCode?: number, data?: any) {
    super(errorMessage);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
    this.data = data;

    // Maintains proper stack trace for where the error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
