import { ApiProperty } from "@nestjs/swagger";

export class AuthExample {

  @ApiProperty({example: 'user@mail.com'})
  readonly username: string;
  @ApiProperty({example: '1234'})
  readonly password: string;

  constructor(
    username: string,
    password: string,
  ) {
    this.username = username;
    this.password = password;
  }

}