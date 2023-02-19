import { ApiProperty } from "@nestjs/swagger";

export class AssignIncidentResponseDTO {

  @ApiProperty({example: 'atribuido'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}