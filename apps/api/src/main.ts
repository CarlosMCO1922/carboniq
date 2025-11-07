import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const origin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [/^http:\/\/localhost:\d+$/];
  app.enableCors({ origin });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
