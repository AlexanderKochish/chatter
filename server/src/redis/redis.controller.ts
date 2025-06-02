import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RedisService } from './redis.service';

@Controller()
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @EventPattern('user:online')
  async notifyUserOnline(@Payload() data: { userId: string }) {
    await this.redisService.notifyUserOnline(data.userId);
  }

  @EventPattern('user:offline')
  async notifyUserOffline(@Payload() data: { userId: string }) {
    await this.redisService.notifyUserOffline(data.userId);
  }
}
