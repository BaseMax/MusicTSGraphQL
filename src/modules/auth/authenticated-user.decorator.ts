import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from 'type-graphql';

export const AuthenticatedDec = createParamDecorator((data: unknown, a) => {
  const gqlCtx = GqlExecutionContext.create(a);
  return gqlCtx.getContext().req.user;
});
