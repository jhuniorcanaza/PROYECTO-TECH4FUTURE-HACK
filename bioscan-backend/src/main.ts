import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global: todas las rutas empiezan por /api
  app.setGlobalPrefix('api');

  // Habilitar CORS para poder llamar desde Bruno, Postman o un frontend
  app.enableCors();

  // Validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // lanza error si envían propiedades no permitidas
      transform: true,            // transforma el body al tipo del DTO
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🌱 Servidor corriendo en http://localhost:${port}/api`);
}
bootstrap();
