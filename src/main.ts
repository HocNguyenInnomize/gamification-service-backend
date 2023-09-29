import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

const globalPrefix = '';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.port || 8888;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.use(bodyParser.json({ type: 'application/cloudevents+json' }));
  app.use(bodyParser.json());

  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: 'diagnostic/liveness', method: RequestMethod.GET }],
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
      disableErrorMessages: isProd,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('CaringUp Gamification Service')
    .setDescription('A service for gamification such as lucky wheel api')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'jwt',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/${globalPrefix}`);
  });
}
bootstrap();
