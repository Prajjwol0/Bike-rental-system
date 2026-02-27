import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/entities/bike.entity';
import { BikeStatus, RequestStatus } from 'src/common/common.enum';
import { UserRequest } from 'src/types/types';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Requests } from './entities/request.entity';

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
      throw new ForbiddenException('Bike not available');

    const existingRequest = await this.requestRepo.findOne({
      where: { renter: { id: renter.id }, bike: { bikeNum: bikeId } },
    });
    if (existingRequest)
      throw new ForbiddenException('You already requested this bike');

    const request = this.requestRepo.create({
      offeredPrice: createRequestDto.offeredPrice || 1000,
      bike,
      renter,
    });

    const savedRequest = await this.requestRepo.save(request);

    return {
      id: savedRequest.id,
      offeredPrice: savedRequest.offeredPrice,
      status: savedRequest.status,
      renter: { id: renter.id, email: renter.email, name: renter.name },
      bike: { bikeNum: bike.bikeNum, brand: bike.brand },
    };
  }

  async findMyRentalRequests(renterId: string) {
    const allRequests = await this.requestRepo.find({
      relations: { renter: true, bike: true },
    });

    const requests = await this.requestRepo.find({
      where: { renter: { id: renterId } },
      relations: { bike: true, renter: true },
    });

    return requests.map((request) => ({
      id: request.id,
      status: request.status,
      offeredPrice: request.offeredPrice,
      bike: {
        bikeNum: request.bike.bikeNum,
        brand: request.bike.brand,
      },
    }));
  }

  // Find own bike's request
  async findRequestForMyBikes(ownerId: string) {
    // Find bikes that belong to this owner
    const bikesOwnedByUser = await this.bikeRepo.find({
      where: { owner: { id: ownerId } },
      select: ['bikeNum'],
    });

    // If user sanga bike xaina vane
    if (!bikesOwnedByUser.length) {
      return [];
    }

    // Step 2: Extract only bike numbers
    const ownedBikeNumbers = bikesOwnedByUser.map((bike) => bike.bikeNum);

    // Step 3: Find requests made for those bikes
    const requests = await this.requestRepo.find({
      where: {
        bike: { bikeNum: In(ownedBikeNumbers) },
      },
      relations: {
        bike: { owner: true },
        renter: true,
      },
    });

    // Step 4: Return clean, frontend-friendly data
    return requests.map((request) => ({
      id: request.id,
      status: request.status,
      createdAt: request.createdAt,
      renter: {
        id: request.renter.id,
        name: request.renter.name,
        email: request.renter.email,
      },
      bike: {
        bikeNum: request.bike.bikeNum,
        brand: request.bike.brand,
      },
      offeredPrice: request.offeredPrice,
    }));
  }

  // Find request by bikeNum
  async findByBikeNum(bikeNum: string, userId: string) {
    //  check if the user owns this bike
    const bike = await this.bikeRepo.findOne({
      where: { bikeNum },
      relations: ['owner'],
    });

    if (!bike) {
      throw new NotFoundException('Bike not found');
    }

    if (bike.owner.id !== userId) {
      throw new ForbiddenException(
        'You can only view requests for your own bikes',
      );
    }

    const requests = await this.requestRepo.find({
      where: { bike: { bikeNum } },
      relations: { bike: true, renter: true },
    });

    return requests.map((req) => ({
      requestId: req.id,
      requestStatus: req.status,
      createdAt: req.createdAt,
      renter: {
        id: req.renter.id,
        name: req.renter.name,
        email: req.renter.email,
      },
      bikeNumber: req.bike.bikeNum,
      bikeBrand: req.bike.brand,
      offeredPrice: req.offeredPrice,
    }));
  }

  // Accept request:
  async decideRequest(
    reqId: string,
    updateRequestDto: UpdateRequestDto,
    user: any,
  ) {
    const request = await this.requestRepo.findOne({
      where: { id: reqId },
      relations: {
        bike: {
          owner: true,
        },
        renter: true,
      },
    });
    if (!request) {
      throw new NotFoundException('Request not found!!');
    }

    // if (request?.status !== RequestStatus.PENDING) {
    //   throw new ForbiddenException('This request is not pending anymore!!');
    // }

    if (request.bike.owner.id !== user.id) {
      throw new ForbiddenException('You can only decide in your own request!!');
    }
    // if (request.status !== RequestStatus.PENDING) {
    //   throw new error('The request is not pending anymore!! ');
    // }
    const oldStatus = request.status;
    const newStatus = updateRequestDto.status;

    request.status = newStatus;

    if (request.status === RequestStatus.ACCEPTED) {
      request.bike.status = BikeStatus.RENTED;
      await this.bikeRepo.save(request.bike);
    } else if (
      newStatus === RequestStatus.REJECTED &&
      oldStatus === RequestStatus.ACCEPTED
    ) {
      request.bike.status = BikeStatus.AVAILABLE;
      await this.bikeRepo.save(request.bike);
    }

    const updatedRequest = await this.requestRepo.save(request);

    return {
      requestId: updatedRequest.id,
      status: updatedRequest.status,
      previousStatus: oldStatus,
      offeredPrice: updatedRequest.offeredPrice,
      renter: {
        id: updatedRequest.renter.id,
        name: updatedRequest.renter.name,
        email: updatedRequest.renter.email,
      },
      bike: {
        bikeNum: updatedRequest.bike.bikeNum,
        brand: updatedRequest.bike.brand,
        status: updatedRequest.bike.status,
      },
    };
  }

  async cancelRequest(reqId: string, userId: string) {
    const request = await this.requestRepo.findOne({
      where: { id: reqId },
      relations: { renter: true, bike: true },
    });

    if (!request) throw new NotFoundException('Request not found');
    if (request.renter.id !== userId)
      throw new ForbiddenException('Not your request');
    if (request.status !== RequestStatus.PENDING)
      throw new ForbiddenException('Can only cancel pending requests');

    await this.requestRepo.remove(request);
    return { message: 'Request cancelled successfully' };
  }
}
