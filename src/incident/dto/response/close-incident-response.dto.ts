import { ApiProperty } from "@nestjs/swagger";

export class CloseIncidentResponseDTO {

  @ApiProperty({example: 'fechado'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}