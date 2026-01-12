import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '@shared/core/interfaces/jwt-payload.interface';
import { AuthenticatedUser } from '@modules/auth/infrastructure/interfaces/authenticated-user.interface';
import { UserRole } from '@modules/user/domain/types/user.role.enum';

export const AuthUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    const userPayload = request.user;

    if (!userPayload) return null;

    const authenticatedUser: AuthenticatedUser = {
      id: userPayload.sub,
      email: userPayload.email,
      role: (userPayload.role as UserRole) || UserRole.USER,
    };

    return data ? authenticatedUser?.[data] : authenticatedUser;
  }
);
