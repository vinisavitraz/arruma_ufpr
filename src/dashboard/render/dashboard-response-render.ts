import { Res } from '@nestjs/common';
import { Response } from 'express';
import { RoleEnum } from 'src/app/enum/role.enum';
import { UserEntity } from 'src/user/entity/user.entity';
import { HeaderPermissionsResponseDTO } from '../dto/response/header-permissions-response.dto';

export class DashboardResponseRender {

  public static renderWithoutUser(@Res() res: Response, view: string, params: object): void {
    return res.render(view, { 
      cssImports: [{filePath: '/styles/style.css'}],
      jsScripts: [],
      ...params,
    });
  }

  public static renderForAuthenticatedUser(@Res() res: Response, view: string, user: UserEntity, params: object = {}): void {
    const headerPermissions: HeaderPermissionsResponseDTO = this.buildHeaderPermissionsByUser(user);
    
    return res.render(view, { 
      headerPermissions: headerPermissions,
      user: user,
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
      ...params,
    });
  }

  private static buildHeaderPermissionsByUser(user: UserEntity): HeaderPermissionsResponseDTO {
    let showMenuIncidents: boolean = user.role === RoleEnum.ADMIN;
    let showMenuMyIncidents: boolean = (user.role === RoleEnum.USER) || (user.role === RoleEnum.ADMIN);
    let showMenuIncidentTypes: boolean = user.role === RoleEnum.ADMIN;
    let showMenuLocations: boolean = user.role === RoleEnum.ADMIN;
    let showMenuItems: boolean = user.role === RoleEnum.ADMIN;
    let showMenuUsers: boolean = user.role === RoleEnum.ADMIN;

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