import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { APIErrorEntity } from 'src/app/entity/api-error.entity';
import { HttpOperationErrorCodes } from '../http-operation-error-codes';

@Catch(BadRequestException)
export class ClassValidatorExceptionFilter implements ExceptionFilter {

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionContent = <any>exception.getResponse();
    const errorCode = exceptionContent.message[0];
    const keys = Object.keys(HttpOperationErrorCodes).filter((x) => HttpOperationErrorCodes[x] == errorCode);
    const key = keys.length > 0 ? keys[0] : '';

    console.log('Bad request exception occurred! Endpoint: ' + request.url + ' Http Status: ' + statusCode + ' | Message: ' + key);

    const responseBody: APIErrorEntity = new APIErrorEntity(statusCode, errorCode, key);
    
    response
      .status(statusCode)
      .json(responseBody);
  }
}