import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from 'src/app/enum/permission.enum';

export const REQUIRE_PERMISSION_KEY = 'require_permission';
export const Permissions = (...permissions: PermissionEnum[]) => SetMetadata(REQUIRE_PERMISSION_KEY, permissions);