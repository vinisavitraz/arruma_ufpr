import { ApiProperty } from "@nestjs/swagger";

export class UserEmailNotFoundExample {

  @ApiProperty({example: '404'})
  readonly statusCode: number;
  @ApiProperty({example: 'USR_001'})
  readonly errorCode: string;
  @ApiProperty({example: 'User with email john.doe@mail.com not found on database.'})
  readonly errorMessage: string;

  constructor(
    statusCode: number,
    errorCode: string,
    errorMessage: string,
  ) {
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }

}