import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BikesController } from './bikes/bikes.controller';
import { BikesModule } from './bikes/bikes.module';
import { DatabaseModule } from './database/database.module';
import { JwtAuthMiddleware } from './middleware/auth.middleware';
import { RequestsController } from './requests/requests.controller';
import { RequestsModule } from './requests/requests.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BikesModule,
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'bikes/all', method: RequestMethod.GET },
        { path: 'requests/(.*)', method: RequestMethod.OPTIONS }, 
      )
      .forRoutes(
        { path: 'requests/:bikeNum', method: RequestMethod.POST },
        RequestsController,
        UsersController,
        BikesController,
        { path: 'bikes/myBike', method: RequestMethod.GET },
        { path: 'requests/my-bikes', method: RequestMethod.GET },
      );
  }
}


