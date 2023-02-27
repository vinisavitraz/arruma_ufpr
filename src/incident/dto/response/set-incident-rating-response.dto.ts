import { ApiProperty } from "@nestjs/swagger";

export class SetIncidentRatingResponseDTO {

  @ApiProperty({example: 'set'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}