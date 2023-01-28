import { user } from "@prisma/client";

export class UserEntity {

  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly roleId: number;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    roleId: number,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.roleId = roleId;
  }

  public static fromRepository(user: user): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role_id,
    );
  }

}