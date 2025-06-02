import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, RedisModule],
  exports: [UserService],
})
export class UserModule {}
