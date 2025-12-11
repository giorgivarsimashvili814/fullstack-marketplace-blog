import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  userId?: string;
}

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.userId;
  },
);
