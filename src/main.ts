import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';
import { config } from 'dotenv';
import helmet from 'helmet';
import * as express from 'express';
import { AppLogger } from './common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

process.env.APPNAME = 'jwt-auth-service';

const env = process.env.NODE_ENV || 'dev';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

async function bootstrap() {
  config();
  const logger = new AppLogger(process.env.APPNAME, { timestamp: true });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger,
  });

  // APIs Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('JWT Auth Service APIs')
    .setDescription('The JWT Auth Service APIs description.')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('apis', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.enableCors();
  app.disable('etag');

  app.use(helmet());
  app.use(express.urlencoded({ limit: '2mb', extended: true }));
  app.use(express.json({ limit: '20mb' }));

  await app.listen(port, host, () => {
    logger.log(`Server is listening on ${host}:${port} in ${env} mode.`);
  });
}
bootstrap();
