import { Module } from '@nestjs/common';
import { RedisController } from './redis.controller';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Module({
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: 'REDIS',
      useFactory: () => {
        if (process.env.REDIS_URL) {
          return new Redis(process.env.REDIS_URL);
        } else {
          return new Redis({
            host: process.env.REDIS_HOST ?? 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD || undefined,
            connectTimeout: 10000,
          });
        }
      },
    },
  ],
  exports: [RedisService, 'REDIS'],
})
export class RedisModule {}
