import { ApiProperty } from "@nestjs/swagger";

export class DeleteItemResponseDTO {

  @ApiProperty({example: 'DELETED'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}