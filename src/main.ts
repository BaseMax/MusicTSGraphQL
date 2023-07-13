import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { raw } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("hello world")
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(raw({ limit: '3mb' }));

  await app.listen(3000);
}
bootstrap();
