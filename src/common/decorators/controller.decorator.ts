import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export function getReqUser(req: any) {
  return req.user || (req.headers.user ? JSON.parse(req.headers.user) : null);
}

export const RequestUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return getReqUser(req);
  },
);
