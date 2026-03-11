import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionHandlerService } from './exception-handler.service';
import { PrismaExceptionFormatter } from '../formatters/prisma-exception.formatter';
import { DtoExceptionFormatter } from '../formatters/dto-exception.formatter';
import { HttpExceptionFormatter } from '../formatters/http-exception.formatter';
import { HttpException } from '@nestjs/common';

describe('ExceptionHandlerService', () => {
  let service: ExceptionHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionHandlerService],
    }).compile();

    service = module.get<ExceptionHandlerService>(ExceptionHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register formatters', () => {
    const formatter = new PrismaExceptionFormatter();
    service.registerFormatter(formatter);
    expect(service.getAllFormatters()).toContain(formatter);
  });

  it('should format HTTP exception', () => {
    service.registerFormatter(new HttpExceptionFormatter());
    const exception = new HttpException('Not found', 404);
    const result = service.formatException(exception);

    expect(result.errors).toHaveLength(1);
    expect(result.message).toBe('Not found');
  });

  it('should format unknown exception', () => {
    const exception = new Error('Test error');
    const result = service.formatException(exception);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].path).toBe('unknown');
    expect(result.message).toBe('Internal server error');
  });
});
