import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { APIErrorEntity } from 'src/app/entity/api-error.entity';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message: string = exception.response ? exception.response.message : '';
    console.log(httpStatus);
    console.log(message);
    const responseBody: APIErrorEntity = new APIErrorEntity(httpStatus, '', message);
    // const responseBody = {
    //   statusCode: httpStatus,
    //   timestamp: new Date().toISOString(),
    //   path: httpAdapter.getRequestUrl(ctx.getRequest()),
    // };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}