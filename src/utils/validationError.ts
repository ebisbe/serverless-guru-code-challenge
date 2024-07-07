import { ZodError } from "zod";

export class ValidationError extends Error {
  message: string;
  statusCode: number;

  constructor(statusCode = 500, message: ZodError) {
    super();
    this.message = JSON.stringify(message);
    this.statusCode = statusCode;
  }
}
