import { ExceptionFormatter } from '../interfaces/exception-formatter.interface';
import { ErrorMessage } from '../interfaces/error-message.interface';
import { isPrismaError } from '../utils/is-prisma-error';
import { PRISMA_ERROR_MESSAGES } from '../constants/default-messages';

export class PrismaExceptionFormatter implements ExceptionFormatter {
  supports(exception: unknown): boolean {
    return isPrismaError(exception);
  }

  format(exception: unknown): ErrorMessage[] {
    const error = exception as Record<string, unknown>;
    const code = error.code as string;
    const meta = error.meta as Record<string, string> | undefined;
    const target = error.target as string[] | undefined;

    const messageTemplate = PRISMA_ERROR_MESSAGES[code] || 'Database operation failed';
    let path = 'unknown';
    let message = messageTemplate;

    if (code === 'P2002' && target && target.length > 0) {
      path = target[0];
      message = messageTemplate.replace('{field}', path);
    } else if (code === 'P2003' && meta?.field_name) {
      path = meta.field_name;
      message = messageTemplate.replace('{field}', path);
    } else if (code === 'P2005' && meta?.field_name) {
      path = meta.field_name;
      message = messageTemplate.replace('{field}', path);
    } else if (code === 'P2006' && meta?.field_name) {
      path = meta.field_name;
      message = messageTemplate.replace('{field}', path);
    } else if (code === 'P2025') {
      path = 'record';
      message = messageTemplate;
    }

    return [{ path, message }];
  }

  message(exception: unknown): string {
    const error = exception as Record<string, unknown>;
    const code = error.code as string;
    return PRISMA_ERROR_MESSAGES[code] || 'Database error';
  }
}
