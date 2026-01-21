import { Module } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './entities/bike.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bike]), // 🔴 THIS WAS MISSING
  ],
  controllers: [BikesController],
  providers: [BikesService],
})
export class BikesModule {}
