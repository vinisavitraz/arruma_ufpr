import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';

@Injectable()
export class AuthenticatedGuard extends AuthGuard('local') {

  constructor(private reflector: Reflector) {
    super();
  }
  
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthenticatedGuard');
    const request: any = context.switchToHttp().getRequest();

    if (request.isAuthenticated()) {
      return true;
    }
  
    throw new HttpOperationException(
      HttpStatus.UNAUTHORIZED, 
      'User not authenticated', 
      HttpOperationErrorCodes.USER_NOT_AUTHENTICATED,
    );
  }

}