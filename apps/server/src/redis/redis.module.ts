import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [RedisController],
  providers: [
    {
      provide: 'REDIS',
      useFactory: (configService: ConfigService) => {
        if (process.env.REDIS_URL) {
          return new Redis(process.env.REDIS_URL);
        }
        return new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD', ''),
          tls: {},
          retryStrategy(times) {
            return Math.min(times * 50, 2000);
          },
        });
      },
      inject: [ConfigService],
    },

    RedisService,
  ],
  exports: [RedisService, 'REDIS'],
  imports: [ConfigModule],
})
export class RedisModule {}
