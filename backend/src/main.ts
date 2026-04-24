import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' });
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Backend rodando em http://localhost:${process.env.PORT ?? 3001}/api`);
}
bootstrap();
