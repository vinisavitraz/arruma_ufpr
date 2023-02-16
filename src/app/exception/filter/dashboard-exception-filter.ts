import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
  } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpOperationException } from '../http-operation.exception';

@Catch(HttpOperationException)
export class DashboardExceptionFilter implements ExceptionFilter {

  catch(exception: HttpOperationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const userAuthenticated: boolean = request.isAuthenticated();
    
    console.log('Dashboard exception occurred! Endpoint: ' + request.url + ' Http Status: ' + statusCode + ' | Message: ' + exception.message);
    
    if (request.url.includes('/dashboard/login')) {
      let redirectUrl: string = '/dashboard/login?errorCode=' + exception.errorCode;
      const mail: string = request.body.username ?? '';

      if (mail !== '') {
        redirectUrl += '&mail=' + mail;
      }

      return response.redirect(redirectUrl);
    }

    if (statusCode === 401 && userAuthenticated) {
      return response.redirect('/dashboard/unauthorized');
    }

    return response.redirect('/dashboard/login');
  }
  
}