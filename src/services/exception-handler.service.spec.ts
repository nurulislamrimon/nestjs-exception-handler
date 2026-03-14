import { Test, TestingModule } from '@nestjs/testing';
import { GlobalExceptionFilter } from '../exception-filter/global-exception.filter';
import { PrismaExceptionFormatter } from '../formatters/prisma-exception.formatter';
import { DtoValidationFormatter } from '../formatters/dto-validation.formatter';
import { OtherExceptionFormatter } from '../formatters/other-exception.formatter';
import { HttpException } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let prismaFormatter: PrismaExceptionFormatter;
  let dtoFormatter: DtoValidationFormatter;
  let otherFormatter: OtherExceptionFormatter;

  beforeEach(() => {
    prismaFormatter = new PrismaExceptionFormatter();
    dtoFormatter = new DtoValidationFormatter();
    otherFormatter = new OtherExceptionFormatter();
    filter = new GlobalExceptionFilter(prismaFormatter, dtoFormatter, otherFormatter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should have all formatters injected', () => {
    expect(prismaFormatter).toBeDefined();
    expect(dtoFormatter).toBeDefined();
    expect(otherFormatter).toBeDefined();
  });
});
