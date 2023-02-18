import { ApiProperty } from "@nestjs/swagger";

export class LogoutResponseDTO {

  @ApiProperty({example: 'User session finished!'})
  message: string;

  constructor(message: string) {
    this.message = message;
  }
    
}