import { ApiProperty } from "@nestjs/swagger";

export class APIErrorEntity {

  @ApiProperty({example: '404'})
  readonly statusCode: number;
  @ApiProperty({example: 'LOC_001'})
  readonly errorCode: string;
  @ApiProperty({example: 'Localização nao encontrada'})
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