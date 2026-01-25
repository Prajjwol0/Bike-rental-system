import { Module } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './entities/bike.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Bike]), PassportModule],
  controllers: [BikesController],
  providers: [BikesService],
})
export class BikesModule {}
