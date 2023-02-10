import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { UserEntity } from "src/user/entity/user.entity";

export class UpdateUserRequestDTO {

  @IsInt({message: HttpOperationErrorCodes.INVALID_USER_ID})
  @ApiProperty({example: 1})
  id: number;

  @IsString({message: HttpOperationErrorCodes.INVALID_USER_NAME})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_USER_NAME})
  @MaxLength(200, {message: HttpOperationErrorCodes.INVALID_USER_NAME})
  @ApiProperty({example: 'John Doe'})
  name: string;


  @IsString({message: HttpOperationErrorCodes.INVALID_USER_EMAIL})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_USER_EMAIL})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_USER_EMAIL})
  @ApiProperty({example: 'john.doe@mail.com'})
  email: string;

  @IsInt({message: HttpOperationErrorCodes.INVALID_USER_ROLE})
  @ApiProperty({example: 1})
  role: number;

  public static fromDashboard(payload: any): UpdateUserRequestDTO {
    const updateUserRequestDTO: UpdateUserRequestDTO = new UpdateUserRequestDTO();

    updateUserRequestDTO.id = Number(payload['id']) ?? 0;
    updateUserRequestDTO.name = payload['name'] ?? '';
    updateUserRequestDTO.email = payload['email'] ?? '';
    updateUserRequestDTO.role = Number(payload['role']) ?? 0;

    return updateUserRequestDTO;
  }

  public static fromEntity(user: UserEntity): UpdateUserRequestDTO {
    const updateUserRequestDTO: UpdateUserRequestDTO = new UpdateUserRequestDTO();

    updateUserRequestDTO.id = user.id;
    updateUserRequestDTO.name = user.name;
    updateUserRequestDTO.email = user.email;
    updateUserRequestDTO.role = user.role;

    return updateUserRequestDTO;

  }

}