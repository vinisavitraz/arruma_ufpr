import { ApiProperty } from "@nestjs/swagger";

export class LocationNotFoundExample {

  @ApiProperty({example: '404'})
  readonly statusCode: number;
  @ApiProperty({example: 'LOC_001'})
  readonly errorCode: string;
  @ApiProperty({example: 'Location with ID 1 not found on database.'})
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