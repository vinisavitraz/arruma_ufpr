import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
import { Request, Response } from 'express';

interface IRequestFlash extends Request {
  flash: any;
}
  
@Catch(HttpException)
export class DashboardExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<IRequestFlash>();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    
    console.log('Dashboard exception occurred! Endpoint: ' + request.url + ' Http Status: ' + statusCode + ' | Message: ' + exception.message);

    const responseBody = {
      status_code: statusCode,
      error_message: exception.message,
    };

    //if (exception instanceof UnauthorizedException || exception instanceof ForbiddenException) {
      request.flash('error', 'Please try again!');
      response.redirect('/dashboard/login');
      return;
    //} 
    
    //response.redirect('/error');
  }
  
}