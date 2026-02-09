import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/features/user/user.module';
import { PrismaModule } from '@/shared/services/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@/shared/redis/redis.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    PrismaModule,
    RedisModule,
  ],
})
export class AuthModule {}
