import { ApiProperty } from "@nestjs/swagger";

export class DeleteLocationResponseDTO {

  @ApiProperty({example: 'DELETED'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}