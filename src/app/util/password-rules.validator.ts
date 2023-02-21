import { HttpStatus } from "@nestjs/common";
import { validateOrReject } from "class-validator";
import { CreateUserWithPasswordRequestDTO } from "src/user/dto/request/create-user-with-password-request.dto";
import { ResetUserPasswordRequestDTO } from "src/user/dto/request/reset-user-password-request.dto";
import { HttpOperationErrorCodes } from "../exception/http-operation-error-codes";
import { HttpOperationException } from "../exception/http-operation.exception";

export class PasswordRulesValidator {

  public static validateChangePassword(changeUserPasswordRequestDTO: ResetUserPasswordRequestDTO): void {
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

  public static validateCreateUser(createUserWithPasswordRequestDTO: CreateUserWithPasswordRequestDTO): void {
    if (!createUserWithPasswordRequestDTO.password || !createUserWithPasswordRequestDTO.confirmPassword) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Passwords do not match.', 
        HttpOperationErrorCodes.PASSWORDS_DO_NOT_MATCH,
      );
    }

    if (createUserWithPasswordRequestDTO.password !== createUserWithPasswordRequestDTO.confirmPassword) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Passwords do not match.', 
        HttpOperationErrorCodes.PASSWORDS_DO_NOT_MATCH,
      );
    }
  }
  

}