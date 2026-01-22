import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';



@ApiTags('bikes')
@ApiBearerAuth('access-token')
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post('register/bikes')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createBikeDto: CreateBikeDto, @CurrentUser() user) {
    return this.bikesService.create(createBikeDto, user);
  }

  @Patch(':bikeNum')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('bikeNum') bikeNum: string,
    @Body() updateBikeDto: UpdateBikeDto,
    @CurrentUser() user,
  ) {
    return this.bikesService.update(bikeNum, updateBikeDto, user);
  }

  @Delete(':bikeNum')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('bikeNum') bikeNum: string, @CurrentUser() user) {
    return this.bikesService.remove(bikeNum, user);
  }

  @Get('all')
  findAll() {
    return this.bikesService.findAll();
  }

  @Get(':bikeNum')
  findOne(@Param('bikeNum') bikeNum:string){
    return this.bikesService.findOne(bikeNum);
  }
}
