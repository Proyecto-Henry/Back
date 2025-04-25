import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loggerGlobal } from './middlewares/logger.middleware';
import { CountriesSeed } from './seeds/countries/countries.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sistema de Gestión y Ventas')
    .setDescription('Api construida con Nestjs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT ?? 3000;

  const countriesSeed = app.get(CountriesSeed);
  await countriesSeed.seed();
  console.log('Se termino la inserción de paises');

  await app.listen(port);
  console.log(`📦 Puerto levantado en http://localhost:${port}`);
}
bootstrap();
