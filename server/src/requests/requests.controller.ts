import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { UserRequest } from 'src/types/types';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestsService } from './requests.service';
// import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post(':bikeId')
  create(
    @Param('bikeId') bikeId: string,
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: UserRequest,
  ) {
    return this.requestsService.createReq(bikeId, createRequestDto, req);
  }
  @Get(':id')
  findOne(
    @Param('id') id:string
  ) {
    return this.requestsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }
}
