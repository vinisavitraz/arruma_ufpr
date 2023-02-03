import { Res } from '@nestjs/common';
import { Response } from 'express';
import { PermissionEnum } from 'src/app/enum/permission.enum';
import { PermissionEntity } from 'src/auth/entity/permission.entity';
import { AuthenticatedUserEntity } from 'src/user/entity/authenticated-user.entity';
import { HeaderPermissionsResponseDTO } from '../dto/response/header-permissions-response.dto';

export class DashboardResponseRender {

  public static renderWithoutUser(@Res() res: Response, view: string, params: object): void {
    return res.render(view, { 
      cssImports: [{filePath: '/styles/style.css'}],
      jsScripts: [],
      ...params,
    });
  }

  public static renderForAuthenticatedUser(@Res() res: Response, view: string, user: AuthenticatedUserEntity, params: object = {}): void {
    const headerPermissions: HeaderPermissionsResponseDTO = this.buildHeaderPermissionsByUser(user);
    
    return res.render(view, { 
      headerPermissions: headerPermissions,
      user: user,
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
      ...params,
    });
  }

  private static buildHeaderPermissionsByUser(user: AuthenticatedUserEntity): HeaderPermissionsResponseDTO {
    const permissions: PermissionEntity[] = user.role.permissions;
    let showMenuIncidents: boolean = false;
    let showMenuMyIncidents: boolean = false;
    let showMenuIncidentTypes: boolean = false;
    let showMenuLocations: boolean = false;
    let showMenuItems: boolean = false;
    let showMenuUsers: boolean = false;

    for (let i = 0; i < permissions.length; i++) {
      const permission: PermissionEntity = permissions[i];

      switch (permission.key) {
        case PermissionEnum.ALL_INCIDENTS_PAGE:
          showMenuIncidents = true;
          break;
        case PermissionEnum.INCIDENTS_PAGE:
          showMenuMyIncidents = true;
          break;
        case PermissionEnum.INCIDENT_TYPES_PAGE:
          showMenuIncidentTypes = true;
          break;
        case PermissionEnum.LOCATIONS_PAGE:
          showMenuLocations = true;
          break;
        case PermissionEnum.ITEMS_PAGE:
          showMenuItems = true;
          break;
        case PermissionEnum.USERS_PAGE:
          showMenuUsers = true;
          break;
        default:
          break;
      }
    }

    return new HeaderPermissionsResponseDTO(
      showMenuIncidents,
      showMenuMyIncidents,
      showMenuIncidentTypes,
      showMenuLocations,
      showMenuItems,
      showMenuUsers,
    );
  }

}