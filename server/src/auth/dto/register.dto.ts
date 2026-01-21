import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Ram Thapa' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'mail@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'pw' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password: string;

}
