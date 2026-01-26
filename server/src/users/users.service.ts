import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  // Create User
  async createUser(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  // Find User By Id
  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  // Find user by email
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // Find all user
  async getAllUser() {
    return await this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        roles: true,
      },
    });
  }

// Get a single user
  async getAUser(id: string) {
    const data = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        roles: true,
      },
    });
    if (!data) {
      throw new NotFoundException('No user with this ID found! lol');
    }
    return data;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('No user with the given id.');
    }
    if (updateUserDto.password) {
      const saltRounds =
        this.configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }
    await this.userRepository.update(id, updateUserDto);
    return {
      message: `User ${id} updated!!`,
    };
  }

  // Logout user
  async logout() {
    return {
      message: 'Logout successfully!!',
    };
  }

  // Delete User
  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('No user found!! TrY aGaIn!!');
    }

    await this.userRepository.delete(id);

    return {
      message: 'User successfully deleted!!',
    };
  }
}
