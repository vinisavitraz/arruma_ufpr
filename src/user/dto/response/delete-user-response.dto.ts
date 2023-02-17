import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserResponseDTO {

  @ApiProperty({example: 'DELETED'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}