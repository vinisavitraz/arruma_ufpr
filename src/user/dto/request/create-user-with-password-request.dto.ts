import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";

export class CreateUserWithPasswordRequestDTO {

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

  @IsString({message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @MinLength(4, {message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @MaxLength(16, {message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @ApiProperty({example: '1234'})
  password: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @MinLength(4, {message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @MaxLength(16, {message: HttpOperationErrorCodes.INVALID_USER_PASSWORD})
  @ApiProperty({example: '1234'})
  confirmPassword: string;

  public static fromDashboard(payload: any): CreateUserWithPasswordRequestDTO {
    const createUserWithPasswordRequestDTO: CreateUserWithPasswordRequestDTO = new CreateUserWithPasswordRequestDTO();

    createUserWithPasswordRequestDTO.id = Number(payload['id']) ?? 0;
    createUserWithPasswordRequestDTO.name = payload['name'] ?? '';
    createUserWithPasswordRequestDTO.document = payload['document'] ?? '';
    createUserWithPasswordRequestDTO.phone = payload['phone'] ?? '';
    createUserWithPasswordRequestDTO.address = payload['address'] ?? '';
    createUserWithPasswordRequestDTO.email = payload['email'] ?? '';
    createUserWithPasswordRequestDTO.role = Number(payload['role']) ?? 0;
    createUserWithPasswordRequestDTO.password = payload['password'] ?? '';
    createUserWithPasswordRequestDTO.confirmPassword = payload['confirmPassword'] ?? '';

    return createUserWithPasswordRequestDTO;
  }

}