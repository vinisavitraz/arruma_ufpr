import { ApiProperty } from "@nestjs/swagger";

export class ReopenIncidentResponseDTO {

  @ApiProperty({example: 'pending'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}