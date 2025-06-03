import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRequest } from 'src/auth/types/auth.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async findOwnProfile(@Req() req: AuthRequest) {
    const user = req['user'];
    return await this.profileService.findOwnProfile(user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Req() req: AuthRequest,
    @Body() uDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/(jpeg|png|jpg|webp|avif)/,
        })
        .addMaxSizeValidator({
          maxSize: 1 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
          exceptionFactory: (errors) => {
            return new UnprocessableEntityException({
              errors,
            });
          },
        }),
    )
    file: Express.Multer.File,
  ) {
    const user = req['user'];
    return await this.profileService.updateProfile(user.userId, uDto, file);
  }
}
