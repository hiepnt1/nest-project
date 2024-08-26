import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // Parse JSON bodies
  app.use(json({ limit: '50mb' }));

  // Parse URL-encoded bodies
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // them tien to trc url api, them exclude => bo link url cho home page
  app.setGlobalPrefix('api/v1', { exclude: [''] })
  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,// prevent redundant info when add info
      forbidNonWhitelisted: true, // notice error when a properties not exist
    }
  )) //like middleware for authentication data for typescript

  // fix cors when req from client
  // config cors
  app.enableCors({
    origin: true,
    methods: "GET,HEAD, PUT, PATCH,POST, DELETE",
    preflightContinue: false,
    credentials: true
  })

  await app.listen(port);
}
bootstrap();
