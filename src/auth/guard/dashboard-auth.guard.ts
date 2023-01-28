import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DashboardAuthGuard extends AuthGuard('local') {

  constructor(private reflector: Reflector) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    
    await super.logIn(request);
    
    return (await super.canActivate(context)) as boolean; 
  }
  
}