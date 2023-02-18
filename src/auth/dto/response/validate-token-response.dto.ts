import { ApiProperty } from "@nestjs/swagger";

export class ValidateTokenResponseDTO {

  @ApiProperty({example: true})
  valid: boolean;
  @ApiProperty({example: '2023-02-23 10:00:00'})
  tokenExpirationDate: string | null;
  
  constructor(
    valid: boolean,  
    tokenExpirationDate: string | null = null, 
  ) {
    this.valid = valid;
    this.tokenExpirationDate = tokenExpirationDate;
  }
    
}