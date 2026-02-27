import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

@ApiTags('bikes')
@ApiBearerAuth('access-token')
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  //  Public
  @Get('all')
  findAll() {
    return this.bikesService.findAll();
  }

  //  Protected
  @Get('myBike')
  findMyBike(@Req() req: any) {
    if (!req.user) {
      throw new UnauthorizedException('Login required');
    }

    return this.bikesService.findMyBike(req.user);
  }

  //  Protected
  @Post('register')
  async create(@Body() dto: CreateBikeDto, @Req() req: any) {
    if (!req.user) {
      throw new UnauthorizedException('Login required');
    }

    return this.bikesService.create(dto, req.user);
  }

  //  Public
  @Get(':bikeNum')
  findOne(@Param('bikeNum') bikeNum: string) {
    return this.bikesService.findOne(bikeNum);
  }

  //  Protected
  @Patch(':bikeNum')
  update(
    @Param('bikeNum') bikeNum: string,
    @Body() dto: UpdateBikeDto,
    @Req() req: any,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Login required');
    }

    return this.bikesService.update(bikeNum, dto, req.user);
  }

  //  Protected
  @Delete(':bikeNum')
  remove(@Param('bikeNum') bikeNum: string, @Req() req: any) {
    if (!req.user) {
      throw new UnauthorizedException('Login required');
    }

    return this.bikesService.remove(bikeNum, req.user);
  }
}
