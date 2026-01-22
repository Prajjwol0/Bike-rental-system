import {
  ConflictException,
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
  async create(dto: CreateBikeDto) {
    const bikeNum = await this.bikeRepository.findOne({
      where: { bikeNum: dto.bikeNum },
    });
    if (bikeNum) {
      throw new ConflictException(' Bike with this number already exists!! ');
    }
    const bikeData = this.bikeRepository.create({ ...dto });
    await this.bikeRepository.save(bikeData);
    return {
      message: 'Bike has been created!!',
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

  async update(bikeNum: string, updateBikeDto: UpdateBikeDto) {
    const bike = this.bikeRepository.findOne({ where: { bikeNum } });
    if (!bike) {
      throw new NotFoundException('No bike with this number found');
    }
    await this.bikeRepository.update(bikeNum, updateBikeDto);

    return `Bike ${bikeNum} updated!!`;
  }

  async remove(bikeNum: string) {
    const bike = this.bikeRepository.findOne({ where: { bikeNum } });
    if (!bike) {
      throw new NotFoundException('No bike with this number found');
    }
    await this.bikeRepository.delete(bikeNum);
    return  `Bike ${bikeNum} deleted!!`
  }
}
