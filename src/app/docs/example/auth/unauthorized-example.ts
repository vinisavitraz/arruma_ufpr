import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedExample {

  @ApiProperty({example: '401'})
  readonly statusCode: number;
  @ApiProperty({example: ''})
  readonly errorCode: string;
  @ApiProperty({example: 'Unauthorized'})
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