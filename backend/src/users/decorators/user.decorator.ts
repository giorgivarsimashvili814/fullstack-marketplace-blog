import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface AuthRequest {
  userId: string;
}

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    return req.userId;
  },
);
