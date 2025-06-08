import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { ChatroomService } from './chat-room.service';
import { AuthRequest } from 'src/features/auth/types/auth.interface';
import { AuthGuard } from 'src/shared/common/guard/auth.guard';

@Controller('chats')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(
    @Body() data: { targetUserId: string },
    @Req() req: AuthRequest,
  ) {
    const { userId } = req['user'];
    return await this.chatroomService.create({
      currentUserId: userId,
      targetUserId: data.targetUserId,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: AuthRequest) {
    const user = req['user'];
    return await this.chatroomService.findAllChatRoom(user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':roomId')
  async findOneChat(
    @Param('roomId') roomId: string,
    @Req() req: AuthRequest,
    @Query('cursor') cursor?: string,
  ) {
    const userId = req['user'].userId;
    return await this.chatroomService.findOneChat(roomId, userId, cursor);
  }

  @UseGuards(AuthGuard)
  @Get(':roomId/images')
  async getAllImagesOfChat(
    @Param('roomId') roomId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req['user'].userId;
    return await this.chatroomService.getAllImagesOfChat(roomId, userId);
  }

  @UseGuards(AuthGuard)
  @Get(':roomId/companion')
  async getCompanion(@Param('roomId') roomId: string, @Req() req: AuthRequest) {
    const userId = req['user'].userId;
    return await this.chatroomService.getCompanion(roomId, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':roomId/delete-chat')
  async removeChatRoom(
    @Param('roomId') roomId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req['user'].userId;
    return await this.chatroomService.deleteChatRoom(roomId, userId);
  }
}
