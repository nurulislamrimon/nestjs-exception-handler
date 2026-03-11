# NestJS Exception Handler

[![npm version](https://badge.fury.io/js/nestjs-exception-handler.svg)](https://badge.fury.io/js/nestjs-exception-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade global exception handling system for NestJS applications that provides standardized error responses, supports Prisma errors, DTO validation, HTTP exceptions, and more.

## Features

- **Standardized Error Responses**: Consistent error format across your application
- **Prisma Integration**: Built-in support for Prisma error codes (P2002, P2003, etc.)
- **DTO Validation**: Automatic extraction of validation errors from class-validator
- **HTTP Exception Support**: Handles all NestJS HTTP exceptions
- **Extensible**: Plugin system for custom formatters
- **Type Safe**: Full TypeScript support
- **Production Ready**: Includes logging and stack trace control

## Installation

```bash
npm install nestjs-exception-handler
```

## Quick Start

### 1. Import the module

```typescript
import { Module } from '@nestjs/common';
import { ExceptionHandlerModule } from 'nestjs-exception-handler';

@Module({
  imports: [ExceptionHandlerModule.forRoot()],
})
export class AppModule {}
```

### 2. Apply the global filter

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from 'nestjs-exception-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const filter = app.get(GlobalExceptionFilter);
  app.useGlobalFilters(filter);

  await app.listen(3000);
}
bootstrap();
```

## Configuration

```typescript
ExceptionHandlerModule.forRoot({
  enableLogging: true, // Enable structured logging
  hideStackTrace: true, // Hide stack traces in production
});
```

## Standard Error Response Format

All responses follow this structure:

```json
{
  "success": false,
  "message": "Database error",
  "errorMessages": [
    {
      "path": "email",
      "message": "User with this email already exists"
    }
  ]
}
```

## Supported Error Types

### Prisma Errors

Handles all Prisma error types with automatic path extraction:

- `P2002` - Unique constraint violation
- `P2003` - Foreign key constraint violation
- `P2005` - Invalid value
- `P2006` - Invalid format
- `P2025` - Record not found

**Example:**

```json
{
  "path": "email",
  "message": "A record with this email already exists."
}
```

### DTO Validation Errors

Automatically extracts validation errors from class-validator:

```typescript
// Example validation error
{
  "path": "email",
  "message": "email must be a valid email"
}
```

### HTTP Exceptions

Handles all NestJS HTTP exceptions:

```typescript
throw new BadRequestException('Invalid input');
```

### Unknown Errors

Fallback handler returns generic error message.

## Creating Custom Formatters

Extend the `ExceptionFormatter` interface to create custom formatters:

```typescript
import { ExceptionFormatter, ErrorMessage } from 'nestjs-exception-handler';

export class CustomExceptionFormatter implements ExceptionFormatter {
  supports(exception: unknown): boolean {
    return exception instanceof CustomError;
  }

  format(exception: unknown): ErrorMessage[] {
    const error = exception as CustomError;
    return [{ path: error.field, message: error.message }];
  }

  message(exception: unknown): string {
    return 'Custom error occurred';
  }
}
```

## API Reference

### ExceptionHandlerModule

- `forRoot(config?)` - Register globally with optional configuration
- `forFeature(config?)` - Register for specific modules

### ExceptionHandlerService

- `registerFormatter(formatter)` - Add custom formatter
- `formatException(exception)` - Format exception to standardized response
- `formatErrors(exception)` - Get error messages array
- `getErrorMessage(exception)` - Get error message string
- `getAllFormatters()` - Get registered formatters

### GlobalExceptionFilter

- Catches all unhandled exceptions
- Logs structured errors
- Returns standardized responses

## Error Response Examples

### Prisma Unique Constraint

```json
{
  "success": false,
  "message": "A record with this email already exists.",
  "errorMessages": [
    {
      "path": "email",
      "message": "A record with this email already exists."
    }
  ]
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errorMessages": [
    {
      "path": "email",
      "message": "email must be a valid email"
    },
    {
      "path": "password",
      "message": "password must be longer than 8 characters"
    }
  ]
}
```

### HTTP Exception

```json
{
  "success": false,
  "message": "Resource not found",
  "errorMessages": [
    {
      "path": "unknown",
      "message": "Resource not found"
    }
  ]
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Author

**Nurul Islam Rimon**

- GitHub: [nurulislamrimon](https://github.com/nurulislamrimon)
