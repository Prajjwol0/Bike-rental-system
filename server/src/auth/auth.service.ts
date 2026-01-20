import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/users/dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/resigter.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds =
      this.configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10;

    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

     await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });

    return await this.userRepository.find({
      where:{
        email : dto.email
      },
      select:{
        id:true,
        email: true,
        name:true,
        roles:true
      }
    })


  }

  // Login
  async login(dto: LoginDto){
    const isUser = await this.usersService.findByEmail(dto.email)
    if(!isUser){
      throw new UnauthorizedException("Invalid credentials!")
    }
    const userPw = await bcrypt.compare(dto.password,isUser.password)
    if(!userPw){
      throw new UnauthorizedException('Invalid credentials!');
    }

    // After matching all credentials --> 
    // Generate JWT:::
    const payload = {
      id: isUser.id,
      email: isUser.email,
      role: isUser.roles,
    }
    // Sign jwt
    const token = this.jwtService.sign(payload,{
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    })
  }
}
