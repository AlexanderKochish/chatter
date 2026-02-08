import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  const redisUrl = process.env.REDIS_URL;

  const redisOptions = redisUrl
    ? (() => {
        const url = new URL(redisUrl);
        return {
          host: url.hostname,
          port: Number(url.port),
          password: url.password || undefined,
          connectTimeout: 10000,
        };
      })()
    : {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        connectTimeout: 10000,
      };

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: redisOptions,
  });
  await app.startAllMicroservices();
}
bootstrap();
