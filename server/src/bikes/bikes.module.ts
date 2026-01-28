import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module'; 
import { JwtAuthMiddleware } from '../middleware/auth.middleware';
import { BikesController } from './bikes.controller';
import { BikesService } from './bikes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './entities/bike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bike]), AuthModule, UsersModule],
  controllers: [BikesController],
  providers: [BikesService],
  exports: [BikesService],
})
export class BikesModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(JwtAuthMiddleware)
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
