import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Configurar títulos de documentación
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Futbol 5 - API')
    .setDescription('API Para reservar canchas de futbol')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // La ruta en que se sirve la documentación
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
