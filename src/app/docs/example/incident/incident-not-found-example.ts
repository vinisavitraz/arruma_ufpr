import { ApiProperty } from "@nestjs/swagger";

export class IncidentNotFoundExample {

  @ApiProperty({example: '404'})
  readonly statusCode: number;
  @ApiProperty({example: 'INC_011'})
  readonly errorCode: string;
  @ApiProperty({example: 'Incident with ID 1 not found on database.'})
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