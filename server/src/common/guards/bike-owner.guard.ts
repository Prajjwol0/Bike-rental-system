import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { BikesService } from 'src/bikes/bikes.service';


@Injectable()
export class BikeOwnerGuard implements CanActivate {
  constructor(
    private readonly bikeService: BikesService
  ){} 
async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user:any = req.user;
    const bikeNum = req.params.bikeNum as any;

    const bike = await this.bikeService.findOne(bikeNum)
    if(!bike) throw new UnauthorizedException("Bike not found")
    if (!user) throw new UnauthorizedException('User not found');
    if(!bike.owner || bike.owner.id.toString() !== user.id.toString()) throw new UnauthorizedException("You are not the owner of bike")
    return true;
  }
}
