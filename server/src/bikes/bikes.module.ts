import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requests } from 'src/requests/entities/request.entity';
import { BikesController } from './bikes.controller';
import { BikesService } from './bikes.service';
import { Bike } from './entities/bike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bike, Requests]), PassportModule],
  controllers: [BikesController],
  providers: [BikesService],
  exports:[BikesService]
})
export class BikesModule {}
