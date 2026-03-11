/**
 * Basic usage example for nestjs-exception-handler
 */

import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExceptionHandlerModule, GlobalExceptionFilter } from 'nestjs-exception-handler';

// 1. Import the module in your AppModule
@Module({
  imports: [ExceptionHandlerModule.forRoot()],
})
export class AppModule {}

// 2. Apply the global filter in main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the filter from the module container
  const filter = app.get(GlobalExceptionFilter);

  // Apply it globally
  app.useGlobalFilters(filter);

  await app.listen(3000);
}

bootstrap();
