import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/user/entity/user.entity";

export class ListUserResponseDTO {

  @ApiProperty()
  readonly user: UserEntity;

  constructor(user: UserEntity) {
    this.user = user;
  }

}