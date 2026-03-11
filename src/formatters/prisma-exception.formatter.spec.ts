import { PrismaExceptionFormatter } from './prisma-exception.formatter';

describe('PrismaExceptionFormatter', () => {
  let formatter: PrismaExceptionFormatter;

  beforeEach(() => {
    formatter = new PrismaExceptionFormatter();
  });

  it('should support Prisma errors', () => {
    const prismaError = {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: { target: ['email'] },
    };
    expect(formatter.supports(prismaError)).toBe(true);
  });

  it('should not support non-Prisma errors', () => {
    const regularError = new Error('Regular error');
    expect(formatter.supports(regularError)).toBe(false);
  });

  it('should format P2002 error correctly', () => {
    const prismaError = {
      code: 'P2002',
      clientVersion: '5.0.0',
      target: ['email'],
    };

    const result = formatter.format(prismaError);
    expect(result).toEqual([
      { path: 'email', message: 'A record with this email already exists.' },
    ]);
  });

  it('should format P2003 error correctly', () => {
    const prismaError = {
      code: 'P2003',
      clientVersion: '5.0.0',
      meta: { field_name: 'userId' },
    };

    const result = formatter.format(prismaError);
    expect(result).toEqual([{ path: 'userId', message: 'This userId does not exist.' }]);
  });

  it('should format unknown Prisma error', () => {
    const prismaError = {
      code: 'UNKNOWN',
      clientVersion: '5.0.0',
    };

    const result = formatter.format(prismaError);
    expect(result).toEqual([{ path: 'unknown', message: 'Database operation failed' }]);
  });

  it('should return correct message for P2002', () => {
    const prismaError = {
      code: 'P2002',
      clientVersion: '5.0.0',
    };

    const message = formatter.message(prismaError);
    expect(message).toBe('A record with this {field} already exists.');
  });
});
