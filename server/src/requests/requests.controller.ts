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

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('my-bikes')
  findRequestForMyBikes(@Req() req: UserRequest) {
    console.log("From req.controller:->", req.user?.id!)
    return this.requestsService.findRequestForMyBikes(req.user?.id!);
  }

  @Post(':bikeId')
  create(
    @Param('bikeId') bikeId: string,
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: UserRequest,
  ) {
    return this.requestsService.createReq(bikeId, createRequestDto, req);
  }

  // Get request by bike number:
  @Get(':bikeNum')
  findByBikeNum(@Param('bikeNum') bikeNum: string) {
    return this.requestsService.findByBikeNum(bikeNum);
  }
}
