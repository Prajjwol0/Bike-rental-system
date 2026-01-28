import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

@ApiTags('bikes')
@ApiBearerAuth('access-token')
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}


  // GET ALL BIKES (public)
  @Get('all')
  findAll() {
    return this.bikesService.findAll();
  }

  // Get own bikes (protected)
  @Get('myBike')
  findMyBike(@Req() req: any) {
    return this.bikesService.findMyBike(req.user);
  }

  // CREATE BIKE (protected)
  @Post('register')
  create(@Body() createBikeDto: CreateBikeDto, @Req() req: Request) {
    return this.bikesService.create(createBikeDto, req.user);
  }

  // PARAMETERIZED ROUTES LAST

  // GET SINGLE BIKE (public)
  @Get(':bikeNum')
  findOne(@Param('bikeNum') bikeNum: string) {
    return this.bikesService.findOne(bikeNum);
  }

  // UPDATE BIKE (protected)
  @Patch(':bikeNum')
  update(
    @Param('bikeNum') bikeNum: string,
    @Body() updateBikeDto: UpdateBikeDto,
    @Req() req: Request,
  ) {
    console.log('Logged-in user:', req.user);
    return this.bikesService.update(bikeNum, updateBikeDto, req.user);
  }

  // DELETE BIKE (protected)
  @Delete(':bikeNum')
  remove(@Param('bikeNum') bikeNum: string, @Req() req: Request) {
    console.log('Hit delete route');
    console.log('Logged-in user:', req.user);
    return this.bikesService.remove(bikeNum, req.user);
  }
}
