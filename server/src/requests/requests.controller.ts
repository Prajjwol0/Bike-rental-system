import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { UserRequest } from 'src/types/types';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('my-bikes')
  findRequestForMyBikes(@Req() req: UserRequest) {
    if (!req.user?.id) return [];
    return this.requestsService.findRequestForMyBikes(req.user.id);
  }

  @Get('my-requests')
  async findMyRentalRequests(@Req() req: UserRequest) {
    if (!req.user?.id) {
      return [];
    }

    const requests = await this.requestsService.findMyRentalRequests(
      req.user.id,
    );

    return requests;
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
  @Post(':bikeNum')
  create(
    @Param('bikeNum') bikeNum: string,
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: UserRequest,
  ) {
  
    return this.requestsService.createReq(bikeNum, createRequestDto, req);
  }

  // get req (Bu id)
  @Get(':bikeNum')
  findByBikeNum(@Param('bikeNum') bikeNum: string, @Req() req: UserRequest) {
    return this.requestsService.findByBikeNum(bikeNum, req.user?.id!);
  }

  @Delete(':reqId/cancel')
  cancelRequest(@Param('reqId') reqId: string, @Req() req: any) {
    return this.requestsService.cancelRequest(reqId, req.user.id);
  }
}
