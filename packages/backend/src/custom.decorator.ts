import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';
export const RequirePermission = (...permissions: string[]) => {
  return SetMetadata('require-permission', permissions);
};

export const RequireLogin = () => {
  return SetMetadata('require-login', true);
};

export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user;
  return data ? user?.[data] : user;
});
