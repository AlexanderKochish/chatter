import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findUsersByName(search: string) {
    return await this.prisma.user.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      select: {
        id: true,
        email: true,
        name: true,
        profile: true,
      },
    });
  }
}
