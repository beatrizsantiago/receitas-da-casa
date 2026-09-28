import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Atrás do nginx do CapRover: usa o IP real do cliente (X-Forwarded-For) no
  // req.ip, senão o rate limit trata todos os usuários como um só
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formatted: Record<string, string[]> = {};
        errors.forEach((err) => {
          formatted[err.property] = Object.values(err.constraints || {});
        });
        return new BadRequestException({
          message: 'Dados inválidos',
          validation_errors: formatted,
        });
      },
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Receitas da Casa API')
      .setDescription('API de gerenciamento de receitas pessoais')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
