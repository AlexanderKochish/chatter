import { Module, Logger } from '@nestjs/common';
import { RedisController } from './redis.controller';
import Redis, { RedisOptions } from 'ioredis';
import { RedisService } from './redis.service';

@Module({
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: 'REDIS',
      useFactory: () => {
        const logger = new Logger('RedisModule');

        const commonOptions: RedisOptions = {
          retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          enableReadyCheck: true,

          maxRetriesPerRequest: null,
        };

        const redis = process.env.REDIS_URL
          ? new Redis(process.env.REDIS_URL, commonOptions)
          : new Redis({
              host: process.env.REDIS_HOST ?? 'localhost',
              port: Number(process.env.REDIS_PORT) || 6379,
              username: process.env.REDIS_USERNAME,
              password: process.env.REDIS_PASSWORD || undefined,
              ...commonOptions,
            });
        redis.on('error', (err) => {
          logger.error('Redis Connection Error', err.stack);
        });

        redis.on('connect', () => {
          logger.log('Successfully connected to Redis');
        });

        return redis;
      },
    },
  ],
  exports: [RedisService, 'REDIS'],
})
export class RedisModule {}
