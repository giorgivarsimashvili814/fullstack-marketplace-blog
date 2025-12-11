import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  id: string;
}

interface RequestWithUser extends Request {
  userId?: string;
  cookies: {
    token?: string;
    [key: string]: string | undefined;
  };
}

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      req.userId = payload.id;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
