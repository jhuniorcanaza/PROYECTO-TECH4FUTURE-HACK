import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para que el frontend de React pueda conectarse
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001', '*'],
    methods: ['GET', 'POST'],
  });

  // Prefijo global /api para todos los endpoints
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🌿 BioScan Backend corriendo en http://localhost:${port}/api`);
}
bootstrap();
