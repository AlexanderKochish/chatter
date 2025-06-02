import { IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  username!: string;
  @IsString()
  @IsOptional()
  avatar!: string | null;
  @IsString()
  @IsOptional()
  avatarPublicId!: string | null;
  @IsString()
  @IsOptional()
  bgImagePublicId!: string | null;
  @IsString()
  @IsOptional()
  bio!: string;
  @IsString()
  @IsOptional()
  bgImage!: string;
}
