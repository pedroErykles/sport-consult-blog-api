import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/interface/users.interface';
import { AuthRequest } from '../interfaces/AuthRequest.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
