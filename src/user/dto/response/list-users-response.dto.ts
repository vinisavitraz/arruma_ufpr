import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/user/entity/user.entity";

export class ListUsersResponseDTO {

  @ApiProperty({ type: [UserEntity] })
  readonly users: UserEntity[];

  constructor(users: UserEntity[]) {
    this.users = users;
  }

}