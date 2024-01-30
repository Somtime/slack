import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import passport from 'passport';
import session from 'express-session';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: ['http://localhost:3090', 'http://localhost:3000'],
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    exposedHeaders: ['Authorization'], // 필요한 헤더 추가
  });

  app.enableCors();

  // app.useStaticAssets(path.join(__dirname, '..', '..', 'uploads'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Slack API')
    .setDescription('Slack API Document')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  app.use(session({ secret: 'secret' }));
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}
bootstrap();
