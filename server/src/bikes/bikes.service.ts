import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { Bike } from './entities/bike.entity';

@Injectable()
export class BikesService {
  constructor(
    @InjectRepository(Bike)
    private bikeRepository: Repository<Bike>,
  ) {}
  // Check if he's an owner
  async isOwner(bikeNum: string, userId: string): Promise<boolean> {
    const bike = await this.bikeRepository.findOne({ where: { bikeNum } });
    if(!bike) return false;
    return bike.owner.id ===  userId
  }

  async create(dto: CreateBikeDto, user: any) {
    const existing = await this.bikeRepository.findOne({
      where: { bikeNum: dto.bikeNum },
    });
    if (existing)
      throw new ConflictException('Bike with this number already exists');

    const bikeData = this.bikeRepository.create({
      ...dto,
      owner: user,
      ownerMail: user.email,
    });

    await this.bikeRepository.save(bikeData);
    return { message: 'Bike has been created!!' };
  }

  async findAll() {
    return await this.bikeRepository.find({
      select: {
        bikeNum: true,
        brand: true,
        createdAt: true,
        lot: true,
        ownerMail: true,
        status:true,
      },
      // relations:['owner']
    });
  }

  async findOne(bikeNum: string) {
    return await this.bikeRepository.findOne({
      where: { bikeNum },
      select: {
        bikeNum: true,
        brand: true,
        createdAt: true,
        lot: true,
        ownerMail: true,
        status: true,
      },
    });
  }

  async findMyBike(user:any){
    
    
    const owner = this.bikeRepository.find({
      where: {ownerMail: user.email},
    })
      const bikes = this.bikeRepository.find({
        where :{ownerMail:user.email}
      })

    return bikes
  }

  async update(bikeNum: string, updateBikeDto: UpdateBikeDto, user: any) {
    const bike = await this.bikeRepository.findOne({
      where: { bikeNum },
      relations: ['owner'],
    });
    if (!bike) throw new NotFoundException('Bike not found !!');

    if (bike.owner.id !== user.id)
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

    if (bike.owner.id !== user.id)
      throw new ForbiddenException('You can only delete your own bike');

    await this.bikeRepository.delete(bikeNum);
    return `Bike ${bikeNum} deleted!!`;
  }
}
