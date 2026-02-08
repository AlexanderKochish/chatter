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
import { Cookies } from '@/shared/common/decorators/cookies.decorator';

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
          error.message || 'Sign-up failed',
        );
      }
      throw new UnprocessableEntityException('Sign-up failed');
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
          error.message || 'Sign-in failed',
        );
      }
      throw new UnprocessableEntityException('Sign-in failed');
    }
  }

  @Post('refresh')
  async refresh(
    @Cookies('refreshToken') refreshToken: string,
    @Cookies('accessToken') accessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken || !accessToken) {
      throw new UnauthorizedException('Missing tokens');
    }
    try {
      const payload =
        await this.authService.verifyAccessTokenIgnoringExpiration(accessToken);

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens(payload.userId, refreshToken);

      this.authService.setCookie(res, newAccessToken, newRefreshToken);

      return { message: 'Tokens refreshed' };
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException('Missing tokens');
      }
      throw new UnauthorizedException('Unknow error');
    }
  }

  @Post('logout')
  async logout(
    @Cookies('accessToken') accessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (accessToken) {
        const payload =
          await this.authService.verifyAccessTokenIgnoringExpiration(
            accessToken,
          );
        await this.authService.logout(payload.userId);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
    }

    return { message: 'Logged out' };
  }
}
