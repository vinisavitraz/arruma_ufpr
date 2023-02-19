import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/user/entity/user.entity";

export class ListUsersResponseDTO {

  @ApiProperty({ type: [UserEntity] })
  readonly entities: UserEntity[];

  constructor(users: UserEntity[]) {
    this.entities = users;
  }

}