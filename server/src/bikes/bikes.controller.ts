import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post('register/bikes')
  create(@Body() createBikeDto: CreateBikeDto) {
    return this.bikesService.create(createBikeDto);
  }

  @Get('all')
  findAll() {
    return this.bikesService.findAll();
  }

  @Get(':bikeNum')
  findOne(@Param('bikeNum') bikeNum: string) {
    return this.bikesService.findOne(bikeNum);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBikeDto: UpdateBikeDto) {
    return this.bikesService.update(+id, updateBikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bikesService.remove(+id);
  }
}
