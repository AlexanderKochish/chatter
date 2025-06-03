import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class SignUpDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
