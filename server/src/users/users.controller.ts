import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('/register')
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.registerUser(createUserDto);
  // }

  // Get all users
  @Get('/allUsers')
  getAllUser() {
    return this.usersService.getAllUser();
  }

  // Get user by id
  @Get('getById/:id')
  getAUser(@Param('id') id: string) {
    return this.usersService.getAUser(id);
  }

  // Own profile
  @Get('/profile')
  // @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: any) {
    return this.usersService.profile(req.user.id);
  }

  //  Update own profile - no ID needed
  @Patch('update')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  // User logout
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return this.usersService.logout();
  }

  //  delete own profile
  @Delete('delete')
  async deleteUser(@Res({ passthrough: true }) res: Response, @Req() req: any) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return this.usersService.deleteUser(req.user.id);
  }
}
