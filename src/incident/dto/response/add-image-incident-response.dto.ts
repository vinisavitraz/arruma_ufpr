import { ApiProperty } from "@nestjs/swagger";

export class AddImageIncidentResponseDTO {

  @ApiProperty({example: 'added'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}