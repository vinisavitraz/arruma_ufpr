import { Res } from '@nestjs/common';
import { Response } from 'express';
import { RoleEnum } from 'src/app/enum/role.enum';
import { UserEntity } from 'src/user/entity/user.entity';
import { HeaderActiveResponseDTO } from '../dto/response/header-active-response.dto';
import { HeaderPermissionsResponseDTO } from '../dto/response/header-permissions-response.dto';

export class DashboardResponseRender {

  public static renderWithoutUser(@Res() res: Response, view: string, params: object): void {
    return res.render(view, { 
      cssImports: [{filePath: '/styles/style.css'}],
      jsScripts: [],
      ...params,
    });
  }

  public static renderForAuthenticatedUser(@Res() res: Response, view: string, user: UserEntity, module: string, params: object = {}): void {
    const headerPermissions: HeaderPermissionsResponseDTO = this.buildHeaderPermissionsByUser(user);
    const headerActive: HeaderActiveResponseDTO = this.buildHeaderActiveByModule(module);

    return res.render(view, { 
      headerPermissions: headerPermissions,
      headerActive: headerActive,
      user: user,
      admin: user.role === RoleEnum.ADMIN,
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

  private static buildHeaderActiveByModule(module: string): HeaderActiveResponseDTO {
    let home: string = module === 'home' ? 'active' : '';
    let incident: string = module === 'incident' ? 'active' : '';
    let myIncident: string = module === 'myIncident' ? 'active' : '';
    let incidentType: string = module === 'incidentType' ? 'active' : '';
    let location: string = module === 'location' ? 'active' : '';
    let item: string = module === 'item' ? 'active' : '';
    let user: string = module === 'user' ? 'active' : '';

    return new HeaderActiveResponseDTO(
      home,
      incident,
      myIncident,
      incidentType,
      location,
      item,
      user,
    );
  }

}