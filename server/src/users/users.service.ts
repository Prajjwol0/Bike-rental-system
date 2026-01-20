import {
  ConflictException,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  async registerUser(dto: CreateUserDto) {
    const saltRounds =
      this.configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10;

    const emailExists = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (emailExists) {
      throw new ConflictException('User with this email already exists!!');
    }

    const hashedPw = await bcrypt.hash(dto.password, saltRounds);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPw,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      roles: savedUser.roles,
      createdAt: savedUser.createdAt,
    };
  }

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
      message: 'Updated !!',
    };
  }

  async logout(res: Response) {
    return {
      message: 'Logout successfully!!',
    };
  }

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
