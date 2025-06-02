import {
  Controller,
  Post,
  Body,
  UnprocessableEntityException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { Cookies } from 'src/decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.signUp(dto);

      this.authService.setCookie(res, accessToken, refreshToken);
      return { message: 'Registration in successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(
          error.message || 'Signup failed',
        );
      }
    }
  }

  @Post('sign-in')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.signIn(
        dto.email,
        dto.password,
      );

      this.authService.setCookie(res, accessToken, refreshToken);
      return { message: 'Logged in successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(
          error.message || 'Signup failed',
        );
      }
    }
  }

  @Post('refresh')
  async refresh(
    @Cookies('refreshToken') refreshToken: string,
    @Cookies('token') accessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken || !accessToken) {
      throw new UnauthorizedException('Missing tokens');
    }

    const payload =
      await this.authService.verifyAccessTokenIgnoringExpiration(accessToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(payload.userId, refreshToken);

    this.authService.setCookie(res, newAccessToken, newRefreshToken);

    return { message: 'Tokens refreshed' };
  }

  @Post('logout')
  async logout(
    @Cookies('token') accessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    const payload =
      await this.authService.verifyAccessTokenIgnoringExpiration(accessToken);

    await this.authService.logout(payload.userId);

    res.clearCookie('refreshToken');
    res.clearCookie('token');

    return { message: 'Logged out' };
  }
}
