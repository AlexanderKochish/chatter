import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findUserByEmail(email: string) {
    return await this.userRepo.findUserByEmail(email);
  }

  async findByName(search: string) {
    if (!search.trim()) {
      return [];
    }
    return await this.userRepo.findUsersByName(search);
  }

  async createUser(dto: CreateUserDto) {
    return await this.userRepo.createUser(dto);
  }

  async findUserById(id: string) {
    return await this.userRepo.findUserById(id);
  }
}
