import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // 'Passport' is a widely-used authentication middleware.
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
 super({
   jwtFromRequest: ExtractJwt.fromExtractors([
     (req) => {
       return req?.cookies?.access_token;
     },
   ]),
   ignoreExpiration: false,
   secretOrKey: configService.get<string>('JWT_SECRET')!,
 });

    console.log('JwtStrategy initialized'); 
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload); // log the token payload
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // This becomes req.user
  }
}
