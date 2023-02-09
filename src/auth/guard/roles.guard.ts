import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/app/enum/role.enum';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { ROLES_KEY } from '../roles/require-roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles: RoleEnum[] = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user }: any = context.switchToHttp().getRequest();
    const allowedAction: boolean = requiredRoles.includes(user.role);
    
    if (!allowedAction) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'User without permissions', 
        HttpOperationErrorCodes.USER_WITHOUT_PERMISSIONS,
      );
    }
    
    return allowedAction;
  }

}