import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen((process.env.PORT, parseInt('0.0.0.0')) || 3000);
}

bootstrap();
