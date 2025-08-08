import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as yaml from 'js-yaml';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Валидация
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());

  // CORS настройка
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  });

  // Префикс API
  app.setGlobalPrefix('api');

  // Swagger конфиг
  const config = new DocumentBuilder()
    .setTitle('API Документация')
    .setDescription('Надеюсь, не всё так плохо, как мне кажется')
    .setVersion('1.0')
    .setContact('Egor', 'https://t.me/egor90909091', 'n778hr@mail.ru')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .build();

  // Создание документа Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Сохраняем в swagger.yaml
  const yamlDocument = yaml.dump(document);
  writeFileSync('swagger.yaml', yamlDocument);

  // Swagger UI на /docs
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 5001, '0.0.0.0');

}

bootstrap();
