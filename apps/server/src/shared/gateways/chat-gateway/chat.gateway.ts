import { ForbiddenException, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/features/message/dto/create-message.dto';
import { DeleteMessageDto } from 'src/features/message/dto/delete-message.dto';
import { UpdateMessageDto } from 'src/features/message/dto/update-message.dto';
import { MessageService } from 'src/features/message/message.service';
import { RedisService } from 'src/shared/redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly redisService: RedisService,
  ) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId as string;

    if (userId) {
      await this.redisService.notifyUserOnline(userId);
    }
  }
  async handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId as string;

    if (userId) {
      await this.redisService.notifyUserOffline(userId);
    }
  }

  @SubscribeMessage('userTyping')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  handleTyping(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.to(data.roomId).emit('userTyping', {
        userId: data.userId,
      });
    } catch (err) {
      console.error('Error while typing message:', err);
      throw err;
    }
  }

  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendMessage(
    @MessageBody()
    data: CreateMessageDto,
  ) {
    try {
      const saveMessage = await this.messageService.saveMessage(data);
      this.server.to(data.roomId).emit('newMessage', saveMessage);
    } catch (err) {
      console.error('Error while saving message:', err);
      throw err;
    }
  }

  @SubscribeMessage('updateMessage')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateMessage(
    @MessageBody() data: Omit<UpdateMessageDto, 'ownerId'>,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.handshake.auth.userId as string;

      const updatedMessage = await this.messageService.updateMessage({
        ...data,
        ownerId: userId,
      });
      this.server.to(data.roomId).emit('updateMessage', updatedMessage);
    } catch (err) {
      console.error('Error while update message:', err);
      throw err;
    }
  }

  @SubscribeMessage('removeMessage')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async removeMessage(
    @MessageBody() data: DeleteMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.handshake?.auth?.userId as string;

      if (!userId) {
        throw new ForbiddenException('Unauthorized');
      }

      if (userId !== data.ownerId) {
        throw new ForbiddenException('Forbidden');
      }

      const removedMessage = await this.messageService.removeMessage(data);
      this.server.to(data.roomId).emit('removeMessage', removedMessage);
    } catch (err) {
      console.error('Error while delete message:', err);
      throw err;
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(roomId);
  }
}
