# NestJS Exception Handler

[![npm version](https://badge.fury.io/js/nestjs-exception-handler.svg)](https://badge.fury.io/js/nestjs-exception-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade global exception handling system for NestJS applications that provides **consistent global error response format** for all types of errors.

## Why This Package Exists

When building NestJS applications, error handling can become inconsistent across different scenarios:

- ValidationPipe errors from class-validator
- HttpException thrown manually
- Prisma database errors
- Unexpected internal server errors

This package ensures **every error response follows the same standardized format**, making your API consistent and easier to consume by clients.

## Features

- **Standardized Error Responses**: Consistent error format across your entire application
- **ValidationPipe Support**: Automatic extraction and normalization of class-validator errors
- **Prisma Integration**: Built-in support for Prisma error codes (P2002, P2003, P2005, P2006, P2025) - works with Prisma 5.x through 7.x
- **HttpException Handling**: Handles all NestJS HTTP exceptions with proper formatting
- **404 Route Handling**: Converts unmatched routes to standardized format
- **Unknown Error Handling**: Safe fallback for unexpected errors without leaking stack traces
- **Extensible**: Plugin system for custom formatters
- **Type Safe**: Full TypeScript support with zero `any` types
- **Production Ready**: Configurable logging and stack trace control
- **NestJS v10 & v11 Compatible**: Works with both major versions
- **Prisma v5 - v7 Compatible**: Works with Prisma 5.x, 6.x, and 7.x

## Installation

```bash
npm install nestjs-exception-handler
```

Or with yarn:

```bash
yarn add nestjs-exception-handler
```

## Quick Setup

### 1. Apply the Global Filter

The simplest way to use the package is to apply the global exception filter:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from 'nestjs-exception-handler';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

### 2. Using with Module Registration (Optional)

For more control, you can use the module registration:

```typescript
import { Module } from '@nestjs/common';
import { ExceptionHandlerModule } from 'nestjs-exception-handler';

@Module({
  imports: [
    ExceptionHandlerModule.forRoot({
      enableLogging: true,
      hideStackTrace: true,
    }),
  ],
})
export class AppModule {}
```

## Error Response Format

Every error response follows this exact structure:

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errorMessages: {
    path: string;
    message: string[];
  }[];
}
```

### Example Response

```json
{
  "success": false,
  "message": "Bad Request Exception",
  "errorMessages": [
    {
      "path": "http_error",
      "message": ["email must be an email", "password must be longer than 8 characters"]
    }
  ]
}
```

## Validation Example

When using ValidationPipe with class-validator, errors are automatically normalized:

```typescript
// DTO
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

**Response:**

```json
{
  "success": false,
  "message": "Bad Request Exception",
  "errorMessages": [
    {
      "path": "http_error",
      "message": ["email must be an email", "password must be longer than or equal to 8 characters"]
    }
  ]
}
```

## HttpException Example

Throwing HTTP exceptions manually:

```typescript
throw new BadRequestException('User already exists');
```

**Response:**

```json
{
  "success": false,
  "message": "Bad Request Exception",
  "errorMessages": [
    {
      "path": "http_error",
      "message": ["User already exists"]
    }
  ]
}
```

Other supported HTTP exceptions:

- `NotFoundException` - Returns "Not Found Exception"
- `UnauthorizedException` - Returns "Unauthorized Exception"
- `ForbiddenException` - Returns "Forbidden Exception"
- `ConflictException` - Returns "Conflict Exception"
- And all other NestJS HTTP exceptions

## Prisma Error Example

The package automatically handles common Prisma errors:

### P2002 - Unique Constraint Violation

```typescript
// When trying to create a user with duplicate email
```

**Response:**

```json
{
  "success": false,
  "message": "Database error",
  "errorMessages": [
    {
      "path": "email",
      "message": ["A record with this email already exists."]
    }
  ]
}
```

### P2003 - Foreign Key Constraint

**Response:**

```json
{
  "success": false,
  "message": "Database error",
  "errorMessages": [
    {
      "path": "userId",
      "message": ["The referenced userId does not exist."]
    }
  ]
}
```

### P2025 - Record Not Found

**Response:**

```json
{
  "success": false,
  "message": "Database error",
  "errorMessages": [
    {
      "path": "record",
      "message": ["The requested record does not exist."]
    }
  ]
}
```

## Unknown Error Example

For unexpected errors:

```json
{
  "success": false,
  "message": "Internal Server Error",
  "errorMessages": [
    {
      "path": "server",
      "message": ["Something went wrong"]
    }
  ]
}
```

Stack traces are never leaked in production (configurable).

## 404 Route Not Found Example

When a client requests a route that doesn't exist, the package automatically converts it to the standardized format:

```json
{
  "success": false,
  "message": "Route Not Found",
  "errorMessages": [
    {
      "path": "route",
      "message": ["Cannot GET /users/test"]
    }
  ]
}
```

The response includes:

- The HTTP method (GET, POST, PATCH, DELETE, etc.)
- The requested URL path

### Examples for Different Methods

**POST to non-existent route:**

```json
{
  "success": false,
  "message": "Route Not Found",
  "errorMessages": [
    {
      "path": "route",
      "message": ["Cannot POST /api/user/test"]
    }
  ]
}
```

**DELETE on non-existent route:**

```json
{
  "success": false,
  "message": "Route Not Found",
  "errorMessages": [
    {
      "path": "route",
      "message": ["Cannot DELETE /api/items/123"]
    }
  ]
}
```

## Best Practices

### 1. Always Use Global ValidationPipe

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);
```

### 2. Configure Based on Environment

```typescript
const config =
  process.env.NODE_ENV === 'production'
    ? { enableLogging: true, hideStackTrace: true }
    : { enableLogging: true, hideStackTrace: false };

app.useGlobalFilters(new GlobalExceptionFilter(config));
```

### 3. Create Custom Formatters

Extend the package for custom error handling:

```typescript
import { ExceptionFormatter, ErrorMessage } from 'nestjs-exception-handler';

export class CustomExceptionFormatter implements ExceptionFormatter {
  supports(exception: unknown): boolean {
    return exception instanceof CustomError;
  }

  format(exception: unknown): ErrorMessage[] {
    const error = exception as CustomError;
    return [
      {
        path: error.field,
        message: [error.message],
      },
    ];
  }

  message(_exception: unknown): string {
    return 'Custom error occurred';
  }
}
```

## API Reference

### GlobalExceptionFilter

```typescript
// Constructor
new GlobalExceptionFilter(service: ExceptionHandlerService, config?: ExceptionHandlerConfig)

// Config options
interface ExceptionHandlerConfig {
  enableLogging?: boolean;  // Default: true
  hideStackTrace?: boolean; // Default: false
}
```

### ExceptionHandlerModule

```typescript
// Register globally
ExceptionHandlerModule.forRoot(config?)

// Register for specific feature
ExceptionHandlerModule.forFeature(config?)
```

### ExceptionHandlerService

```typescript
// Register custom formatter
service.registerFormatter(formatter: ExceptionFormatter)

// Format exception
service.formatException(exception: unknown): { errors: ErrorMessage[]; message: string }

// Get all registered formatters
service.getAllFormatters(): ExceptionFormatter[]
```

## Response Examples Summary

| Error Type    | Example                                                 |
| ------------- | ------------------------------------------------------- |
| Validation    | `message: ["email must be an email"]`                   |
| HttpException | `message: ["User already exists"]`                      |
| Prisma P2002  | `message: ["A record with this email already exists."]` |
| 404 Not Found | `message: ["Cannot GET /unknown-route"]`                |
| Unknown       | `message: ["Something went wrong"]`                     |

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
