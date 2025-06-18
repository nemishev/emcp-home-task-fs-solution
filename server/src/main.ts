import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const SERVER_PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks(); // Tells NestJS to handle shutdown signals
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(SERVER_PORT);
}
bootstrap();
