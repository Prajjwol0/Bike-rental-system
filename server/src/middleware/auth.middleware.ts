import { Injectable, NestMiddleware } from '@nestjs/common';
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
    if (req.method === 'OPTIONS') return next();
    try {
      const token = req.cookies?.access_token;

      if (!token) {
        return res.status(401).json({
          message: 'No token provided',
        });
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        return res.status(401).json({
          message: 'User not found',
        });
      }

      (req as any).user = user;

      next();
    } catch (error) {
      res.clearCookie('access_token');

      return res.status(401).json({
        message: 'Session expired. Please login again.',
      });
    }
  }
}
