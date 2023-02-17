import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { UserEntity } from "src/user/entity/user.entity";

export class CreateUserRequestDTO {

  @ApiHideProperty()
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

  public static fromDashboard(payload: any): CreateUserRequestDTO {
    const createUserRequestDTO: CreateUserRequestDTO = new CreateUserRequestDTO();

    createUserRequestDTO.id = Number(payload['id']) ?? 0;
    createUserRequestDTO.name = payload['name'] ?? '';
    createUserRequestDTO.document = payload['document'] ?? '';
    createUserRequestDTO.phone = payload['phone'] ?? '';
    createUserRequestDTO.address = payload['address'] ?? '';
    createUserRequestDTO.email = payload['email'] ?? '';
    createUserRequestDTO.role = Number(payload['role']) ?? 0;

    return createUserRequestDTO;
  }

  public static fromEntity(user: UserEntity): CreateUserRequestDTO {
    const createUserRequestDTO: CreateUserRequestDTO = new CreateUserRequestDTO();

    createUserRequestDTO.id = user.id;
    createUserRequestDTO.name = user.name;
    createUserRequestDTO.document = user.document;
    createUserRequestDTO.phone = user.phone;
    createUserRequestDTO.address = user.address;
    createUserRequestDTO.email = user.email;
    createUserRequestDTO.role = user.role;

    return createUserRequestDTO;
  }

}