import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Inject
} from '@nestjs/common';
import { Request, Response } from 'express';
import { APIErrorEntity } from 'src/app/entity/api-error.entity';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';

@Catch(HttpOperationException)
export class HttpOperationExceptionFilter implements ExceptionFilter {

  catch(exception: HttpOperationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const ip = (request.ip) ? (request.ip === '::1') ? '127.0.0.1' : request.ip : '';

    console.log('Http operation exception occurred! Endpoint: ' + request.url + ' Http Status: ' + statusCode + ' | Message: ' + exception.message);

    const responseBody: APIErrorEntity = new APIErrorEntity(statusCode, exception.errorCode, exception.message);
    
    console.log(responseBody);

    response
      .status(statusCode)
      .json(responseBody);
    
  }

}
