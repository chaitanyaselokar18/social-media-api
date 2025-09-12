import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true; // no roles required

    // Get the user from request
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Check if user has any required role
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) throw new ForbiddenException('You do not have permission');
    return true;
  }
}
