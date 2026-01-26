import { Body, Controller, Post, Req } from '@nestjs/common';
import type { UserRequest } from 'src/types/types';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto,bikeId,@Req() req:UserRequest) {
    return this.requestsService.createReq(bikeId, createRequestDto,req);
  }

  // @Get()
  // findAll() {
  //   return this.requestsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.requestsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
  //   return this.requestsService.update(+id, updateRequestDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.requestsService.remove(+id);
  // }
}
