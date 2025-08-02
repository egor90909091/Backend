import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as yaml from 'js-yaml';
import { writeFileSync } from 'fs';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  const config = new DocumentBuilder()
    .setTitle('API Документация')             // Заголовок документации
    .setDescription('Надеюсь не все так плохо как мне кажется')    // Описание
    .setVersion('1.0')                         // Версия API
    .setContact('Egor','https://t.me/egor90909091','n778hr@mail.ru')             
    .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
    'access-token', // это имя схемы, важно!
    )
    .build();

  // Создание документа Swagger
  const document = SwaggerModule.createDocument(app, config);
  
  const yamlDocument = yaml.dump(document);
  writeFileSync('swagger.yaml', yamlDocument); 
  // Подключение Swagger UI к пути '/api'
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 5001);

}
bootstrap();
