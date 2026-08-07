export class AppError extends Error {
  constructor(
    message: string,
    public readonly _statusCode: number,
    public readonly _code: string,
    public readonly _details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 500, "DATABASE_ERROR", details);
  }
}

export class InternalError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 500, "INTERNAL_ERROR", details);
  }
}
