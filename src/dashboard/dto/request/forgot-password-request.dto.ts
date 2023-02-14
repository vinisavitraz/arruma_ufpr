import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";

export class ForgotPasswordRequestDTO {

  @IsString({message: HttpOperationErrorCodes.INVALID_USER_EMAIL})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_USER_EMAIL})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_USER_EMAIL})
  @ApiProperty({example: 'john.doe@mail.com'})
  email: string;

  public static fromDashboard(payload: any): ForgotPasswordRequestDTO {
    const forgotPasswordRequestDTO: ForgotPasswordRequestDTO = new ForgotPasswordRequestDTO();

    forgotPasswordRequestDTO.email = payload['email'] ?? '';

    return forgotPasswordRequestDTO;
  }

}