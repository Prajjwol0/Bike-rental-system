import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
// import { UserRoles } from 'src/common/common.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Ram Thapa',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'mail@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'pw',
  })
  @IsString()
  password: string;

  // @ApiProperty({
  //   example: UserRoles.USER,
  // })
  // @IsEnum(UserRoles)
  // roles: UserRoles;
}
