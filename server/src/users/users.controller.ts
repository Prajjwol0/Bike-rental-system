import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('/register')
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.registerUser(createUserDto);
  // }

  @Get('/allUsers')
  getAllUser() {
    return this.usersService.getAllUser();
  }
  
  @Get('getById/:id')
  getAUser(@Param('id') id: string) {
    return this.usersService.getAUser(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
res.clearCookie('access_token', {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 60000*60*24*7, //7 days
});

    return this.usersService.logout();
  }

  @Delete('delete/:id') 
  async deleteUser(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return this.usersService.deleteUser(id);
  }
}
