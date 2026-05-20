import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (_, ctx: ExecutionContext): number => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user || typeof req.user.userId !== 'number') {
      throw new UnauthorizedException();
    }
    return req.user.userId;
  },
);
