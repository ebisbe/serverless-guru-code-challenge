export class HttpError extends Error {
  message: string;
  statusCode: number;

  constructor(statusCode = 500, message = "Unknown error.") {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
