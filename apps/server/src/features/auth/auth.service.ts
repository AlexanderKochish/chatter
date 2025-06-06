import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/features/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Response } from 'express';
import { RedisService } from 'src/shared/redis/redis.service';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly redisService: RedisService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async signUp(
    dto: SignUpDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.userService.findUserByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('User already exist');
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(dto.password, salt);

    const newUser = {
      ...dto,
      password: hashPassword,
    };

    const { email, name, id } = await this.userService.createUser(newUser);

    const { accessToken, refreshToken } = await this.generateToken(
      id,
      email,
      name as string,
    );

    await this.redisService.saveRefreshToken(id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signIn(email: string, password: string) {
    const existingUser = await this.userService.findUserByEmail(email);

    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password not accepted');
    }

    const { id, name } = existingUser;

    const { accessToken, refreshToken } = await this.generateToken(
      id,
      email,
      name as string,
    );

    await this.redisService.saveRefreshToken(id, refreshToken);

    return { accessToken, refreshToken };
  }

  async generateToken(userId: string, email: string, name: string) {
    const payload = {
      userId,
      email,
      name,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = randomUUID();

    return { refreshToken, accessToken };
  }

  async refreshTokens(userId: string, oldRefreshToken: string) {
    const savedToken = await this.redis.get(`refresh_token:${userId}`);
    if (savedToken !== oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findUserById(userId);
    const newToken = await this.generateToken(
      user?.id as string,
      user?.email as string,
      user?.name as string,
    );

    await this.redisService.saveRefreshToken(
      user?.id as string,
      newToken.refreshToken,
    );

    return newToken;
  }

  async verifyAccessTokenIgnoringExpiration(token: string) {
    return await this.jwt.verifyAsync<{
      userId: string;
      token: string;
      options: JwtVerifyOptions;
    }>(token, {
      secret: process.env.JWT_SECRET as string,
      ignoreExpiration: true,
    });
  }

  async logout(userId: string) {
    return await this.redis.del(`refresh_token:${userId}`);
  }

  setCookie(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    });
  }
}
