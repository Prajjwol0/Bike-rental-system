import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('bikes')
@ApiBearerAuth('access-token') // Swagger scheme
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  //               CREATE BIKE
  @Post('register/bikes')
  @UseGuards(AuthGuard('jwt')) // Must match JwtStrategy
  create(@Body() createBikeDto: CreateBikeDto, @Req() req: Request) {
    console.log('Hit create route');
    console.log('Authorization header:', req.headers['authorization']);
    console.log('Logged-in user:', req.user);
    return this.bikesService.create(createBikeDto, req.user);
  }

  //               UPDATE BIKE
  @Patch(':bikeNum')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('bikeNum') bikeNum: string,
    @Body() updateBikeDto: UpdateBikeDto,
    @Req() req: Request,
  ) {
    console.log('Logged-in user:', req.user);
    return this.bikesService.update(bikeNum, updateBikeDto, req.user);
  }

  //               DELETE BIKE
  @Delete(':bikeNum')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('bikeNum') bikeNum: string, @Req() req: Request) {
    console.log('Hit delete route');
    console.log('Logged-in user:', req.user);
    return this.bikesService.remove(bikeNum, req.user);
  }

  //               GET ALL BIKES
  @Get('all')
  findAll() {
    return this.bikesService.findAll();
  }

  //   GET SINGLE BIKE  `
  @Get(':bikeNum')
  findOne(@Param('bikeNum') bikeNum: string) {
    return this.bikesService.findOne(bikeNum);
  }
}
