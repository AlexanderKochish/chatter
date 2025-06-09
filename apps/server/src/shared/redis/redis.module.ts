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
        const redisUrl = process.env.REDIS_URL;
        console.log('Connecting to Redis with URL:', redisUrl);

        if (redisUrl) {
          return new Redis(redisUrl, {
            tls: {},
            retryStrategy(times) {
              return Math.min(times * 50, 2000);
            },
          });
        }

        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          // tls: {},
          retryStrategy(times) {
            return Math.min(times * 50, 2000);
          },
        });
      },
    },
  ],
  exports: [RedisService, 'REDIS'],
})
export class RedisModule {}
