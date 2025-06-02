import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByName(search: string) {
    if (!search.trim()) {
      return [];
    }
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
