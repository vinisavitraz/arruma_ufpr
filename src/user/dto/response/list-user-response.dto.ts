import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/user/entity/user.entity";

export class ListUserResponseDTO {

  @ApiProperty()
  readonly entity: UserEntity;

  constructor(user: UserEntity) {
    this.entity = user;
  }

}