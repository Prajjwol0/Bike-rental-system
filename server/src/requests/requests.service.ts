import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/entities/bike.entity';
import { UserRequest } from 'src/types/types';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Requests } from './entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Bike)
    private readonly bikeRepo:Repository<Bike>,
    // private readonly bikeService:BikesService,
    @InjectRepository(Requests)
    private readonly requestRepo:Repository<Requests>,
    @InjectRepository(User)
    private readonly userRepo:Repository<User>
  ){}

  async createReq(bikeId:string,createRequestDto: CreateRequestDto, req:UserRequest) {
    const id = req?.user?.id;
    const bike = await this.bikeRepo.findOne({
      where: {bikeNum:createRequestDto.bikeId},
      relations:['owner']
    })
    console.log(bike)
    if(!bike){
      throw new NotFoundException("Bike not found!!")
    }
    const user = await this.userRepo.findOne({
      where:{id}
    })
    // if(user.id === bike.owner.id){
    //   throw new ForbiddenException("Cannot rent your own bike!!")
    // }
    const request = this.requestRepo.create({
      
    })

    return {
      message:"Bike requent sent!!"
      // this.
    };
  }

  findAll() {
    return `This action returns all requests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
