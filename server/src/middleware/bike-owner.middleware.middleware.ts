import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { BikesService } from 'src/bikes/bikes.service';

@Injectable()
export class BikeOwnerMiddleware implements NestMiddleware {
  constructor(private readonly bikeService: BikesService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user: any = (req as any).user;
    const bikeNum = String(req.params.bikeNum);

    if (!user) {
      throw new UnauthorizedException('User is not authorized');
    }
    const bike = await this.bikeService.findOne(bikeNum);

    if (!bike) {
      throw new UnauthorizedException('Bike not found');
    }

    if (!bike.owner || bike.owner.id !== user.id) {
      throw new UnauthorizedException('Only bike owner are allowed!!');
    }
    next();
  }
}
