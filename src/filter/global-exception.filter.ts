import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionHandlerService } from '../services/exception-handler.service';
import { StandardErrorResponse } from '../interfaces/error-message.interface';
import { ExceptionHandlerConfig } from '../interfaces/exception-handler-config.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private config: ExceptionHandlerConfig;

  constructor(
    private exceptionHandlerService: ExceptionHandlerService,
    config?: ExceptionHandlerConfig,
  ) {
    this.config = config || { enableLogging: true, hideStackTrace: false };
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { errors, message } = this.exceptionHandlerService.formatException(exception);
    const status = this.getStatusCode(exception);

    const errorResponse: StandardErrorResponse = {
      success: false,
      message,
      errorMessages: errors,
    };

    if (this.config.enableLogging) {
      this.logError(request, status, errors, exception);
    }

    response.status(status).json(errorResponse);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private logError(
    request: Request,
    status: number,
    errorMessages: { path: string; message: string }[],
    exception: unknown,
  ): void {
    const method = request.method;
    const url = request.url;
    const timestamp = new Date().toISOString();

    const logData = {
      timestamp,
      method,
      url,
      status,
      errorMessages,
      stack: this.config.hideStackTrace ? undefined : (exception as Error)?.stack,
    };

    this.logger.error(`${method} ${url} - ${status}`, JSON.stringify(logData));
  }
}
