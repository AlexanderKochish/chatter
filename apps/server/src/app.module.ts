import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { PrismaModule } from './shared/services/prisma/prisma.module';
import { ProfileModule } from './features/profile/profile.module';
import { ChatroomModule } from './features/chat-room/chat-room.module';
import { MessageModule } from './features/message/message.module';
import { EventsModule } from './shared/gateways/chat-gateway/chat-gateway.module';
import { RedisModule } from './shared/redis/redis.module';
import { UploadModule } from './shared/upload/upload.module';
import { CloudinaryModule } from './shared/configs/cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProfileModule,
    ChatroomModule,
    MessageModule,
    EventsModule,
    RedisModule,
    UploadModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
