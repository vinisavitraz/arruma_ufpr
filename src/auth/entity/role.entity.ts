import { permission, role, role_permission } from "@prisma/client";
import { PermissionEntity } from "./permission.entity";

export class RoleEntity {

  readonly name: string;
  readonly key: string;
  readonly permissions: PermissionEntity[];

  constructor(name: string, key: string, permissions: PermissionEntity[]) {
    this.name = name;
    this.key = key;
    this.permissions = permissions;
  }

  public static fromRepository(role: role & {permissions: (role_permission & {permission: permission})[]}): RoleEntity {
    const permissions: PermissionEntity[] = role.permissions.map((rolePermission: role_permission & {permission: permission}) => {
      return PermissionEntity.fromRepository(rolePermission.permission);
    });

    return new RoleEntity(
      role.name,
      role.key,
      permissions,
    );
  }

}