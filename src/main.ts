import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('boostrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors(corsConfig);
  } else {
    app.enableCors(corsConfig);
  }

  const serverConfig = config.get('server');

  const port = process.env.PORT || serverConfig.port;
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
