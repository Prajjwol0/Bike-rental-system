import { ConflictException, Injectable } from '@nestjs/common';
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
  async create(dto: CreateBikeDto) {
    const bikeNum = await this.bikeRepository.findOne({
      where: { bikeNum: dto.bikeNum },
    });
    if (bikeNum) {
      throw new ConflictException(' Bike with this number already exists!! ');
    }
    const bikeData = this.bikeRepository.create({
      bikeNum: dto.bikeNum,
      brand: dto.brand,
      lot: dto.lot,
    });
    await this.bikeRepository.save(bikeData);
    return {
      message: 'Bike has been created!!',
      bikeData,
    };
  }

  async findAll() {
    return await this.bikeRepository.find();
  }

  async findOne(bikeNum: string) {
    const bike = await this.bikeRepository.findOne({
      where: { bikeNum },
      select: {
        bikeNum: true,
        brand: true,
        lot: true,
      },
    });
    return bike;
  }

  update(id: number, updateBikeDto: UpdateBikeDto) {
    return `This action updates a #${id} bike`;
  }

  remove(id: number) {
    return `This action removes a #${id} bike`;
  }
}
