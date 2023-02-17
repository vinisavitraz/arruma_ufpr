import { ApiProperty } from "@nestjs/swagger";

export class ItemNotFoundExample {

  @ApiProperty({example: '404'})
  readonly statusCode: number;
  @ApiProperty({example: 'ITM_004'})
  readonly errorCode: string;
  @ApiProperty({example: 'Item with ID 1 not found on database.'})
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