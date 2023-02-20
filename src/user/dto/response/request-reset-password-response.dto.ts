import { ApiProperty } from "@nestjs/swagger";

export class RequestResetPasswordResponseDTO {

  @ApiProperty({example: 'deliveredOnMail'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}