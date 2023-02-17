import { ApiProperty } from "@nestjs/swagger";

export class DeleteIncidentResponseDTO {

  @ApiProperty({example: 'DELETED'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}