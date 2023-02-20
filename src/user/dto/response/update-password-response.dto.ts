import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordResponseDTO {

  @ApiProperty({example: 'updated'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}