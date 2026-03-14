import { Injectable } from '@nestjs/common';
import { IErrorMessage } from '../interfaces/error-message.interface';

@Injectable()
export class OtherExceptionFormatter {
  formatOtherError(exception: unknown): IErrorMessage[] {
    if (
      exception &&
      typeof exception === 'object' &&
      'path' in exception &&
      'message' in exception
    ) {
      return [
        {
          path: String((exception as Record<string, unknown>).path),
          message: String((exception as Record<string, unknown>).message),
        },
      ];
    }

    const message =
      exception && typeof exception === 'object' && 'message' in exception
        ? String((exception as Record<string, unknown>).message)
        : 'An unexpected error occurred';

    return [
      {
        path: 'unknown',
        message,
      },
    ];
  }
}
