import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('!!!--> JWT Middleware hit for:', req.path);
    try {
      const token = req.cookies.access_token;
      if (!token) {
        throw new UnauthorizedException('No token is provided !!!!');
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      (req as any).user = user; // attach user
      next();
    } catch (error) {
      console.log('!!!--->  Middleware error:', error.message);
      res.clearCookie('access_token');
      return res.status(401).json({
        message: 'Session expired. Please login again.',
      });
    }
  }
}
