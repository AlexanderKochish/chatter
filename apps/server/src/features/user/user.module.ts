import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { RedisModule } from 'src/shared/redis/redis.module';
import { UserRepository } from './user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [PrismaModule, RedisModule],
  exports: [UserService],
})
export class UserModule {}
