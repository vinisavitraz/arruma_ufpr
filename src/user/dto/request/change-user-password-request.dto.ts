import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";

export class ChangeUserPasswordRequestDTO {

  @ApiHideProperty()
  userId: number;

  @ApiHideProperty()
  tokenId: number;

  @IsString({message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @MinLength(4, {message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @MaxLength(16, {message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @ApiProperty({example: 'd@sal12!313'})
  password: string;


  @IsString({message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @MinLength(4, {message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @MaxLength(16, {message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @ApiProperty({example: 'dsal12!313'})
  confirmPassword: string;

  public static fromDashboard(payload: any): ChangeUserPasswordRequestDTO {
    const changeUserPasswordRequestDTO: ChangeUserPasswordRequestDTO = new ChangeUserPasswordRequestDTO();
    
    changeUserPasswordRequestDTO.userId = Number(payload['userId']) ?? 0;
    changeUserPasswordRequestDTO.password = payload['password'] ?? '';
    changeUserPasswordRequestDTO.confirmPassword = payload['confirmPassword'] ?? '';

    return changeUserPasswordRequestDTO;
  }

}