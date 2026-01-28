import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikesModule } from 'src/bikes/bikes.module';
import { Bike } from 'src/bikes/entities/bike.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module'; 
import { Requests } from './entities/request.entity';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Requests, Bike, User]),
    ConfigModule,
    BikesModule,
    UsersModule, 
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
