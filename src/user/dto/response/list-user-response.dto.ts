import { UserEntity } from "src/user/entity/user.entity";

export class ListUserResponseDTO {

  readonly user: UserEntity;

  constructor(user: UserEntity) {
    this.user = user;
  }

}