
import { CanActivate, ExecutionContext, HttpStatus, mixin, Type } from '@nestjs/common';
import { PermissionEnum } from 'src/app/enum/permission.enum';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { PermissionEntity } from '../entity/permission.entity';
 
const PermissionGuard = (permission: PermissionEnum): Type<CanActivate> => {
  
  class PermissionGuardMixin implements CanActivate {
    
    canActivate(context: ExecutionContext) {
      const { user } = context.switchToHttp().getRequest();

      if (!user) {
        throw new HttpOperationException(
          HttpStatus.UNAUTHORIZED, 
          'Authenticated user not found', 
          HttpOperationErrorCodes.INVALID_AUTHENTICATED_USER,
        );
      }
      
      if (!user.role) {
        throw new HttpOperationException(
          HttpStatus.UNAUTHORIZED, 
          'User without role', 
          HttpOperationErrorCodes.USER_WITHOUT_ROLE,
        );
      }

      if (!user.role.permissions || user.role.permissions.length === 0) {
        throw new HttpOperationException(
          HttpStatus.UNAUTHORIZED, 
          'User without permissions', 
          HttpOperationErrorCodes.USER_WITHOUT_PERMISSIONS,
        );
      }
      
      for (let i = 0; i < user.role.permissions.length; i++) {
        const permissionEntity: PermissionEntity = user.role.permissions[i];
        if (permissionEntity.key === permission) {
          return true;
        }
      }
      
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'User without permission', 
        HttpOperationErrorCodes.USER_WITHOUT_PERMISSION,
      );
    }
  }
 
  return mixin(PermissionGuardMixin);
}
 
export default PermissionGuard;