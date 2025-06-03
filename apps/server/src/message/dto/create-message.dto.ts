import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text!: string;

  @IsString()
  roomId!: string;

  @IsString()
  ownerId!: string;

  @IsOptional()
  images!: {
    name: string;
    type: string;
    buffer: number[];
  }[];
}
