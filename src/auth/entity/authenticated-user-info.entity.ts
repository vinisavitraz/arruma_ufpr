import { ApiProperty } from "@nestjs/swagger";

export class AuthenticatedUserInfoEntity {

  @ApiProperty({example: 1})
  userId: number;
  @ApiProperty({example: 'john.doe@mail.com'})
  userEmail: string;
  @ApiProperty({example: 'John Doe'})
  userName: string;
  @ApiProperty({example: 1})
  userRole: number;
  
  constructor(
      userId: number, 
      userEmail: string, 
      userName: string, 
      userRole: number,
  ) {
      this.userId = userId;
      this.userEmail = userEmail;
      this.userName = userName;
      this.userRole = userRole;
  }

}