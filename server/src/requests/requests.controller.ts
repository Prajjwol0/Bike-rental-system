import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req
} from '@nestjs/common';
import type { UserRequest } from 'src/types/types';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // Get request
  @Get('my-bikes')
  findRequestForMyBikes(@Req() req: UserRequest) {
    return this.requestsService.findRequestForMyBikes(req.user?.id!);
  }

  // Accept or decline the request:
  @Patch(':reqId/decide')
  decideRequest(
    @Param('reqId') reqId: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @Req() req: any,
  ) {
    return this.requestsService.decideRequest(
      reqId,
      updateRequestDto,
      req.user,
    );
  }

  // Post req
  @Post(':bikeId')
  create(
    @Param('bikeId') bikeId: string,
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: any,
  ) {
    return this.requestsService.createReq(bikeId, createRequestDto, req.user);
  }

  // get req (Bu id)
  @Get(':bikeNum')
  findByBikeNum(@Param('bikeNum') bikeNum: string, @Req() req: UserRequest) {
    return this.requestsService.findByBikeNum(bikeNum, req.user?.id!);
  }
}
