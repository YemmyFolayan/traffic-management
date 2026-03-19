import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'name', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'createdAt'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  async count() {
    return this.userRepository.count();
  }
}
