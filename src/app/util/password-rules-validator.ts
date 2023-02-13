import { HttpStatus } from "@nestjs/common";
import { ChangeUserPasswordRequestDTO } from "src/user/dto/request/change-user-password-request.dto";
import { HttpOperationErrorCodes } from "../exception/http-operation-error-codes";
import { HttpOperationException } from "../exception/http-operation.exception";

export class PasswordRulesValidator {

  public static validate(changeUserPasswordRequestDTO: ChangeUserPasswordRequestDTO): void {
    if (!changeUserPasswordRequestDTO.password || !changeUserPasswordRequestDTO.confirmPassword) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Passwords do not match.', 
        HttpOperationErrorCodes.PASSWORDS_DO_NOT_MATCH,
      );
    }

    if (changeUserPasswordRequestDTO.password !== changeUserPasswordRequestDTO.confirmPassword) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Passwords do not match.', 
        HttpOperationErrorCodes.PASSWORDS_DO_NOT_MATCH,
      );
    }
  }

}