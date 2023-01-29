import { IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";

export class CreateLocationRequestDTO {

  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  name: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @MaxLength(500, {message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  description: string;

}