import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { user } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity {

  @ApiProperty({example: 1})
  readonly id: number;

  @ApiProperty({example: 'John Doe'})
  readonly name: string;

  @ApiProperty({example: '41996691200'})
  readonly phone: string;

  @ApiProperty({example: '53089037009'})
  readonly document: string;

  @ApiProperty({example: 'Fake quarter, number 1 - PR'})
  readonly address: string;

  @ApiProperty({example: 'user@mail.com'})
  readonly email: string;

  @Exclude()
  @ApiHideProperty()
  readonly password: string;
  
  @ApiProperty({example: 1})
  readonly role: number;

  constructor(
    id: number,
    name: string,
    phone: string,
    document: string,
    address: string,
    email: string,
    password: string,
    role: number,
  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.document = document;
    this.address = address;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  public static fromRepository(user: user): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.phone,
      user.document,
      user.address,
      user.email,
      user.password,
      user.role,
    );
  }

}