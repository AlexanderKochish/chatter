import { CreateMessageDto } from './create-message.dto';
import { IsString } from 'class-validator';

export class UpdateMessageDto extends CreateMessageDto {
  @IsString()
  msgId!: string;
}
