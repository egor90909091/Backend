import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
