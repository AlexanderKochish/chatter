import { IsString } from 'class-validator';

export class CreateChatroomDto {
  @IsString()
  targetUserId!: string;
  @IsString()
  currentUserId!: string;
}
