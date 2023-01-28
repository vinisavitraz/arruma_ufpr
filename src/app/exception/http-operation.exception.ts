import { HttpException, HttpStatus } from "@nestjs/common";
import { HttpOperationErrorCodes } from "./http-operation-error-codes";

export class HttpOperationException extends HttpException {

    errorCode: HttpOperationErrorCodes;

    constructor(httpStatus: HttpStatus, errorMessage: string, errorCode: HttpOperationErrorCodes) {
      super(errorMessage, httpStatus);

      this.errorCode = errorCode;
    }
  }