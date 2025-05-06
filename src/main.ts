import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loggerGlobal } from './middlewares/logger.middleware';
import { CountriesSeed } from './seeds/countries/countries.seed';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Cambia esto por el origen de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si usas cookies o auth headers
  });
  app.use(loggerGlobal);
  //!Controlador de errores personalizado
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const myErrors = errors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        });
        return new BadRequestException({
          alert: 'Se detectaron los siguientes errores en la peticion:',
          errors: myErrors,
        });
      },
    }),
  );
  //!FIN DE CONTROLADOR DE ERRORES PERSONALIZADOS
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
