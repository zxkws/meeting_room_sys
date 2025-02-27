import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      return true;
    }

    const permissions = request.user.permissions;
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('require-permission', [context.getClass(), context.getHandler()]);

    if (!requiredPermissions) {
      return true;
    }

    for (let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find((item) => item.code === curPermission);
      if (!found) {
        throw new ForbiddenException('您没有访问该接口的权限');
      }
    }

    return true;
  }
}
