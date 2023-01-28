import { permission } from "@prisma/client";

export class PermissionEntity {

  readonly name: string;
  readonly key: string;

  constructor(name: string, key: string) {
    this.name = name;
    this.key = key;
  }

  public static fromRepository(permission: permission): PermissionEntity {
    return new PermissionEntity(
      permission.name,
      permission.key,
    );
  }

}