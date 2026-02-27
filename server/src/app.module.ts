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
        // Auth routes
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        // Public user routes
        { path: 'users/allUsers', method: RequestMethod.GET },
        { path: 'users/getById/:id', method: RequestMethod.GET },
        // Public bike routes
        { path: 'bikes/all', method: RequestMethod.GET },
        { path: 'bikes/:bikeNum', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: 'users/*', method: RequestMethod.ALL },
        { path: 'bikes/*', method: RequestMethod.ALL },
        { path: 'requests/*', method: RequestMethod.ALL }, 
      );
  }
}
