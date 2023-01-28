import { RoleEntity } from "src/auth/entity/role.entity";
import { UserEntity } from "./user.entity";

export class AuthenticatedUserEntity {

  readonly user: UserEntity;
  readonly role: RoleEntity;

  constructor(user: UserEntity, role: RoleEntity) {
    this.user = user;
    this.role = role;
  }

}