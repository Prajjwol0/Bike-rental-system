import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/entities/bike.entity';
import { UserRequest } from 'src/types/types';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
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

  // Find all your bike's request

  async findRequestForMyBikes(ownerId: string) {
    // Step 1: Get ONLY bikes owned by this user
    const myBikes = await this.bikeRepo.find({
      where: { owner: { id: ownerId } },
      select: ['bikeNum'], // Use bikeNum instead of 'id' [web:11]
    });

    if (myBikes.length === 0) {
      return [];
    }

    // Step 2: Get requests for ONLY those bikes
    const bikeNums = myBikes.map((bike) => bike.bikeNum);

    return await this.requestRepo.find({
      where: {
        bike: {
          bikeNum: In(bikeNums), // Use bikeNum, not 'id'
        },
      },
      relations: {
        bike: {
          owner: true,
        },
        renter: true,
      },
    });
  }

  // Find request by bikeNum
  async findByBikeNum(bikeNum: string) {
    const request = await this.requestRepo.find({
      where: {
        bike: { bikeNum },
      },
      relations: {
        bike: true,
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
