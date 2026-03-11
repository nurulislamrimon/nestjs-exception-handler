/**
 * Example of creating a custom formatter
 */

import { ExceptionFormatter, ErrorMessage } from 'nestjs-exception-handler';

// Define your custom error type
export class CustomBusinessError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message);
    this.name = 'CustomBusinessError';
  }
}

// Create a custom formatter
export class CustomBusinessErrorFormatter implements ExceptionFormatter {
  supports(exception: unknown): boolean {
    return exception instanceof CustomBusinessError;
  }

  format(exception: unknown): ErrorMessage[] {
    const error = exception as CustomBusinessError;
    return [
      {
        path: error.field,
        message: error.message,
      },
    ];
  }

  message(exception: unknown): string {
    const error = exception as CustomBusinessError;
    return error.message;
  }
}

// Usage in your application
// service.ts
// const formatter = new CustomBusinessErrorFormatter();
// exceptionHandlerService.registerFormatter(formatter);
