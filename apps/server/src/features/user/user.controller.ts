import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@/shared/redis/redis.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async findByName(@Query('search') search: string) {
    return await this.userService.findByName(search);
  }

  @Post('online')
  async checkUserOnline(@Body() data: { usersIds: string[] }) {
    return await this.redisService.isUserOnline(data.usersIds);
  }
}
