import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();
    const cookies = request.cookies as Record<string, string>;
    return data ? cookies?.[data] : cookies;
  },
);
