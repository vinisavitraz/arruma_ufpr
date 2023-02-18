import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  static PUBLIC_ENDPOINT_KEY = 'publicEndpoint';

  constructor(private reflector: Reflector) {
    super();
  }
  
  public canActivate(context: ExecutionContext): any {
    const publicEndpoint: boolean = this.reflector.getAllAndOverride<boolean>(JwtAuthGuard.PUBLIC_ENDPOINT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (publicEndpoint) {
      return true;
    }

    return super.canActivate(context);
  }

}
