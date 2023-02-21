import { ApiProperty } from "@nestjs/swagger";

export class UserNotRegisteredResponseDTO {

  @ApiProperty({example: 'notRegistered'})
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }

}