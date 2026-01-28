import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/entities/bike.entity';
import { UserRequest } from 'src/types/types';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Requests } from './entities/request.entity';
import { BikeStatus } from 'src/common/common.enum';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Bike)
    private readonly bikeRepo: Repository<Bike>,
    // private readonly bikeService:BikesService,
    @InjectRepository(Requests)
    private readonly requestRepo: Repository<Requests>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Create request
  async createReq(
    bikeId: string,
    createRequestDto: CreateRequestDto,
    req: UserRequest,
  ) {
    const userId = req?.user?.id;
    if (!userId) throw new ForbiddenException('Unauthorized');

    const renter = await this.userRepo.findOne({ where: { id: userId } });
    if (!renter) throw new NotFoundException('User not found');

    const bike = await this.bikeRepo.findOne({
      where: { bikeNum: bikeId },
      relations: ['owner'],
    });
    if (!bike) throw new NotFoundException('Bike not found');
    if (!bike.owner) throw new ForbiddenException('Bike has no owner');

    if (bike.owner.id === renter.id)
      throw new ForbiddenException('Cannot rent your own bike');

    if (bike.status !== BikeStatus.AVAILABLE)
      throw new ForbiddenException('Bike is not available');

    const existingRequest = await this.requestRepo.findOne({
      where: {
        renter: { id: renter.id },
      },
    });

    if (existingRequest)
      throw new ForbiddenException('You already requested this bike');

    const request = this.requestRepo.create({
      offeredPrice: createRequestDto.offeredPrice,
      bike,
      renter,
    });

    const savedRequest = await this.requestRepo.save(request);

    // response
    return {
      id: savedRequest.id,
      offeredPrice: savedRequest.offeredPrice,
      status: savedRequest.status,
      renter: {
        id: renter.id,
        email: renter.email,
        name: renter.name,
      },
      bike: {
        bikeNum: bike.bikeNum,
        brand: bike.brand,
        owner: {
          id: bike.owner.id,
          email: bike.owner.email,
          name: bike.owner.name,
        },
        status: bike.status,
      },
    };
  }

  // Find all request
  findAll() {
    return this.requestRepo.find({
      relations: {
        bike: true,
        renter: true,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        offeredPrice: true,

        renter: {
          id: true,
          email: true,
          name: true,
        },
      },
    });
  }

  // Find one request
  async findOne(id: string) {
    const request = await this.requestRepo.findOne({
      where: { id },
      
      relations: {
        renter: true,
      },
    });
    return request;
  }

  // update request
  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
