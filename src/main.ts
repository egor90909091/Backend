import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  const config = new DocumentBuilder()
    .setTitle('API Documentation')             // Заголовок документации
    .setDescription('Описание вашего API')    // Описание
    .setVersion('1.0')                         // Версия API
    .addTag('example')                         // Тег для группировки эндпоинтов (необязательно)
    .build();

  // Создание документа Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Подключение Swagger UI к пути '/api'
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 5001);

}
bootstrap();
