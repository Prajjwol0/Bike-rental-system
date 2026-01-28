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
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        // Public user routes
        { path: 'users/allUsers', method: RequestMethod.GET },
        { path: 'users/getById/:id', method: RequestMethod.GET },
        // Public bike routes
        { path: 'bikes/all', method: RequestMethod.GET },
        // Public request routes
        { path: 'requests', method: RequestMethod.GET }, // View all requests (public)
        { path: 'requests/:id', method: RequestMethod.GET }, // View single request (public)
      )
      .forRoutes(
        BikesController,
        UsersController,
        RequestsController, 
      );
  }
}