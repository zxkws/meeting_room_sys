import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

interface JwtPayload {
  userId: number;
  username: string;
  roles: string[];
  permissions: string[];
}

declare module 'express' {
  interface Request {
    user: JwtPayload;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  @Inject(JwtService)
  private readonly jwtService: JwtService;
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requireLogin = this.reflector.getAllAndOverride('require-login', [context.getHandler(), context.getClass()]);
    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const decodedToken = this.jwtService.verify<JwtPayload>(token);
      request.user = decodedToken;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('用户未登录');
    }
  }
}
