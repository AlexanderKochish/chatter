import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async notifyUserOnline(userId: string) {
    await this.redis.set(`user:${userId}:online`, 'true', 'EX', 3000);
  }

  async notifyUserOffline(userId: string) {
    await this.redis.del(`user:${userId}:online`);
  }

  async isUserOnline(usersIds: string[]) {
    const pipeline = this.redis.pipeline();
    usersIds.forEach((id) => pipeline.get(`user:${id}:online`));

    const result = await pipeline.exec();
    if (!result) return {};

    const statuses = usersIds.reduce(
      (acc, id, i) => {
        acc[id] = result[i][1] === 'true';
        return acc;
      },
      {} as Record<string, boolean>,
    );
    return statuses;
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    return await this.redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60,
    );
  }
}
