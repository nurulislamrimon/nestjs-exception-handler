import { Injectable } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
} from '@prisma/client/runtime/library';
import { IErrorMessage } from '../interfaces/error-message.interface';
import { ExceptionFormatter } from '../interfaces/exception-formatter.interface';

type PrismaError =
  | PrismaClientKnownRequestError
  | PrismaClientValidationError
  | PrismaClientRustPanicError
  | PrismaClientInitializationError
  | unknown;

@Injectable()
export class PrismaExceptionFormatter implements ExceptionFormatter {
  supports(exception: unknown): boolean {
    return (
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientValidationError ||
      exception instanceof PrismaClientRustPanicError ||
      exception instanceof PrismaClientInitializationError
    );
  }

  format(exception: unknown): IErrorMessage[] {
    return this.formatError(exception as PrismaError);
  }

  message(_exception: unknown): string {
    return 'Database error';
  }

  formatError(exception: PrismaError): IErrorMessage[] {
    if (exception instanceof PrismaClientKnownRequestError) {
      return this.formatPrismaError(exception);
    }

    if (
      exception instanceof PrismaClientValidationError ||
      exception instanceof PrismaClientRustPanicError
    ) {
      return this.formatQueryError(exception);
    }

    if (exception instanceof PrismaClientInitializationError) {
      return this.formatInitializationError(exception);
    }

    return this.formatUnknownError(exception);
  }

  private formatPrismaError(exception: PrismaClientKnownRequestError): IErrorMessage[] {
    const code = exception.code;
    const meta = exception.meta as Record<string, unknown> | undefined;

    switch (code) {
      case 'P2002': {
        const target = meta?.target as string[] | undefined;
        const field = target?.[0] || 'field';
        return [
          {
            path: field,
            message: `A record with this ${field} already exists.`,
          },
        ];
      }
      case 'P2003': {
        const fieldName = meta?.field_name as string | undefined;
        return [
          {
            path: fieldName || 'field',
            message: `The referenced ${fieldName || 'record'} does not exist.`,
          },
        ];
      }
      case 'P2005': {
        const fieldName = meta?.field_name as string | undefined;
        return [
          {
            path: fieldName || 'field',
            message: `The value for ${fieldName || 'field'} is invalid.`,
          },
        ];
      }
      case 'P2006': {
        const fieldName = meta?.field_name as string | undefined;
        return [
          {
            path: fieldName || 'field',
            message: `The ${fieldName || 'field'} field is required.`,
          },
        ];
      }
      case 'P2025': {
        return [
          {
            path: 'record',
            message: 'The requested record does not exist.',
          },
        ];
      }
      default:
        return [
          {
            path: 'database',
            message: 'Database operation failed.',
          },
        ];
    }
  }

  private formatQueryError(
    exception: PrismaClientValidationError | PrismaClientRustPanicError,
  ): IErrorMessage[] {
    let message = 'Invalid database query.';

    if (exception instanceof PrismaClientRustPanicError) {
      message = 'Database engine panic occurred.';
    }

    return [
      {
        path: 'database',
        message,
      },
    ];
  }

  private formatInitializationError(exception: PrismaClientInitializationError): IErrorMessage[] {
    return [
      {
        path: 'database',
        message: `Database initialization error: ${exception.message}`,
      },
    ];
  }

  private formatUnknownError(exception: unknown): IErrorMessage[] {
    return [
      {
        path: 'unknown',
        message:
          exception instanceof Error ? exception.message : 'An unexpected database error occurred.',
      },
    ];
  }
}
