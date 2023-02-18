import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDTO {

  @ApiProperty({example: 1})
  readonly userId: number;
  @ApiProperty({example: 'dskadjkj2k1n321mn3'})
  readonly token: string;
  @ApiProperty({example: '2023-03-01 17:55:53'})
  readonly tokenExpirationDate: string;
  
  constructor(
    userId: number,
    token: string,
    tokenExpirationDate: string,
  ) {
    this.userId = userId;
    this.token = token;
    this.tokenExpirationDate = tokenExpirationDate;
  }
    
}