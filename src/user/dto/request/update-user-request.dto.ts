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

  @IsString({message: HttpOperationErrorCodes.INVALID_USER_DOCUMENT})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_USER_DOCUMENT})
  @MaxLength(15, {message: HttpOperationErrorCodes.INVALID_USER_DOCUMENT})
  @ApiProperty({example: '53089037009'})
  document: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_USER_PHONE})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_USER_PHONE})
  @MaxLength(15, {message: HttpOperationErrorCodes.INVALID_USER_PHONE})
  @ApiProperty({example: '41996691200'})
  phone: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_USER_ADDRESS})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_USER_ADDRESS})
  @MaxLength(500, {message: HttpOperationErrorCodes.INVALID_USER_ADDRESS})
  @ApiProperty({example: 'Fake quarter, number 1 - PR'})
  address: string;

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
    updateUserRequestDTO.document = payload['document'] ?? '';
    updateUserRequestDTO.phone = payload['phone'] ?? '';
    updateUserRequestDTO.address = payload['address'] ?? '';
    updateUserRequestDTO.email = payload['email'] ?? '';
    updateUserRequestDTO.role = Number(payload['role']) ?? 0;

    return updateUserRequestDTO;
  }

  public static fromEntity(user: UserEntity): UpdateUserRequestDTO {
    const updateUserRequestDTO: UpdateUserRequestDTO = new UpdateUserRequestDTO();

    updateUserRequestDTO.id = user.id;
    updateUserRequestDTO.name = user.name;
    updateUserRequestDTO.document = user.document;
    updateUserRequestDTO.phone = user.phone;
    updateUserRequestDTO.address = user.address;
    updateUserRequestDTO.email = user.email;
    updateUserRequestDTO.role = user.role;

    return updateUserRequestDTO;

  }

}