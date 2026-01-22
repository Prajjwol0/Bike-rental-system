import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from './entities/bike.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BikesService {
  constructor(
    @InjectRepository(Bike)
    private bikeRepository: Repository<Bike>,
  ) {}

  async create(dto: CreateBikeDto, user: any) {
    const existing = await this.bikeRepository.findOne({
      where: { bikeNum: dto.bikeNum },
    });
    if (existing)
      throw new ConflictException('Bike with this number already exists');

    const bikeData = this.bikeRepository.create({
      ...dto,
      owner: { id: user.userId },
      ownerMail: user.email,
    });

    await this.bikeRepository.save(bikeData);
    return { message: 'Bike has been created!!' };
  }

  async findAll() {
    return await this.bikeRepository.find({
      select:{
         bikeNum: true,
         brand: true,
         createdAt:true,
         lot: true,
         ownerMail:true,
      }
    });
  }

  async findOne(bikeNum: string) {
    return await this.bikeRepository.findOne({
      where: { bikeNum },
      select: { bikeNum: true, brand: true, lot: true },
    });
  }

  async update(bikeNum: string, updateBikeDto: UpdateBikeDto, user: any) {
    const bike = await this.bikeRepository.findOne({
      where: { bikeNum },
      relations: ['owner'],
    });
    if (!bike) throw new NotFoundException('No bike with this number found');

    if (bike.owner.id !== user.userId)
      throw new ForbiddenException('You can only update your own bike');

    await this.bikeRepository.update(bikeNum, updateBikeDto);
    return `Bike ${bikeNum} updated!!`;
  }

  async remove(bikeNum: string, user: any) {
    const bike = await this.bikeRepository.findOne({
      where: { bikeNum },
      relations: ['owner'],
    });
    if (!bike) throw new NotFoundException('No bike with this number found');

    if (bike.owner.id !== user.userId)
      throw new ForbiddenException('You can only delete your own bike');

    await this.bikeRepository.delete(bikeNum);
    return `Bike ${bikeNum} deleted!!`;
  }
}
