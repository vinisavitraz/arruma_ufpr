import { Controller, Get, UseFilters, UseGuards, Request, Res, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Response } from 'express';
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { ApiExcludeController } from "@nestjs/swagger";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";
import { DashboardIncidentService } from "../service/dashboard-incident.service";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { Roles } from "src/auth/roles/require-roles.decorator";
import { RoleEnum } from "src/app/enum/role.enum";
import { LocationEntity } from "src/location/entity/location.entity";
import { CreateIncidentRequestDTO } from "src/incident/dto/request/create-incident-request.dto";
import { IncidentEntity } from "src/incident/entity/incident.entity";
import { ItemEntity } from "src/item/entity/item.entity";
import { IncidentInteractionEntity } from "src/incident/entity/incident-interaction.entity";
import { CreateIncidentInteractionRequestDTO } from "src/incident/dto/request/create-incident-interaction-request.dto";
import { IncidentStatusEnum } from "src/app/enum/status.enum";
import { UserEntity } from "src/user/entity/user.entity";
import { RolesGuard } from "src/auth/guard/roles.guard";

@Controller('dashboard/incident')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardIncidentController {
  
  constructor(private readonly service: DashboardIncidentService) {}

  @Get('create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getCreateIncidentPage(@Request() req, @Res() res: Response): Promise<void> {    
    const incidentTypes: IncidentTypeEntity[] = await this.service.findIncidentTypes();
    const locations: LocationEntity[] = await this.service.findLocations();

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident',
      req.user,
      'incident',
      {
        incidentTypes: incidentTypes,
        locations: locations,
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/incident/create-incident.js'}],
        incident: new CreateIncidentRequestDTO(),
        uri: '/dashboard/incident/create',
      }
    );
  }

  @Get('user')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getUserIncidentsPage(@Request() req, @Res() res: Response): Promise<void> { 
    const status: string = req.query.status ?? '';
    const incidents: IncidentEntity[] = await this.service.findUserIncidentsByStatus(req.user, status);
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/my-incidents',
      req.user,
      'myIncident',
      {
        activeTab: status,
        incidents: incidents,
        showContent: incidents.length > 0,
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}, {filePath: '/styles/incidents.css'}],
      }
    );
  }

  @Get('assign/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async assignIncidentToAdmin(@Param('id', ParseIntPipe) incidentId: number, @Request() req, @Res() res: Response): Promise<void> { 
    const origin: string = req.query.origin ?? '';
    await this.service.assignIncidentToAdmin(req.user, incidentId);
    
    return res.redirect('/dashboard/incident/' + incidentId + '?origin=' + origin);
  }

  @Get('close/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async closeIncident(@Param('id', ParseIntPipe) incidentId: number, @Request() req, @Res() res: Response): Promise<void> { 
    const origin: string = req.query.origin ?? '';
    await this.service.closeIncident(req.user, incidentId);
    
    return res.redirect('/dashboard/incident/' + incidentId + '?origin=' + origin);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getIncidentPage(@Param('id', ParseIntPipe) incidentId: number, @Request() req, @Res() res: Response): Promise<void> {  
    const origin: string = req.query.origin ?? '';
    let backUrl: string = '/dashboard/incident';
    let view: string = 'incident';

    if (origin === 'userIncidents') {
      backUrl = '/dashboard/incident/user';
      view = 'myIncident';
    }

    const user: UserEntity = req.user; 
    const incident: IncidentEntity = await this.service.findUserIncidentByIDOrCry(user, incidentId);
    const incidentInteractions: IncidentInteractionEntity[] = await this.service.findIncidentInteractions(incident.id);
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incident-detail',
      user,
      view,
      {
        origin: origin,
        backUrl: backUrl,
        admin: user.role === RoleEnum.ADMIN,
        incident: incident,
        incidentInteractions: incidentInteractions,
        showContent: incidentInteractions.length > 0,
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}, {filePath: '/styles/timeline.css'}],
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/incident/incident-detail.js'}],
        showButtonAssign: incident.status === IncidentStatusEnum.OPEN && user.role === RoleEnum.ADMIN,
        showButtonClose: incident.status !== IncidentStatusEnum.CLOSED,
        showButtonNewMessage: incident.status !== IncidentStatusEnum.CLOSED,
      }
    );
  }

  @Get('edit/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getEditIncidentPage(@Param('id', ParseIntPipe) incidentId: number, @Request() req, @Res() res: Response): Promise<void> {   
    const user: UserEntity = req.user; 
    const incident: IncidentEntity = await this.service.findUserIncidentByIDOrCry(user, incidentId);
    const incidentTypes: IncidentTypeEntity[] = await this.service.findIncidentTypes();
    const locations: LocationEntity[] = await this.service.findLocations(); 
    const items: ItemEntity[] = await this.service.findItemsByLocationID(incident.locationId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident',
      req.user,
      'incident',
      {
        incident: CreateIncidentRequestDTO.fromEntity(incident),
        uri: '/dashboard/incident/update',
        incidentTypes: incidentTypes,
        locations: locations,
        items: items,
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/incident/create-incident.js'}],
      }
    );
  }

  @Post('create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async createIncident(@Request() req, @Res() res: Response): Promise<void> { 
    const createIncidentRequestDTO: CreateIncidentRequestDTO = CreateIncidentRequestDTO.fromDashboard(req.body, req.user);

    try {
      await this.service.createIncident(createIncidentRequestDTO);
    } catch (errors) {
      const incidentTypes: IncidentTypeEntity[] = await this.service.findIncidentTypes();
      const locations: LocationEntity[] = await this.service.findLocations(); 
      const items: ItemEntity[] = await this.service.findItemsByLocationID(createIncidentRequestDTO.locationId);

      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'incident/create-incident',
        req.user,
        'incident',
        {
          incidentTypes: incidentTypes,
          locations: locations,
          items: items,
          incident: createIncidentRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/incident/user');
  }

  @Post('interaction')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async addInteractionToIncident(@Request() req, @Res() res: Response): Promise<void> { 
    const createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO = CreateIncidentInteractionRequestDTO.fromDashboard(req.body, req.user);

    try {
      await this.service.createIncidentInteraction(req.user, createIncidentInteractionRequestDTO);
    } catch (errors) {
      return res.redirect('/dashboard/incident');
    }  

    return res.redirect('/dashboard/incident/' + createIncidentInteractionRequestDTO.incidentId);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getIncidentsPage(@Request() req, @Res() res: Response): Promise<void> { 
    const status: string = req.query.status ?? '';
    const incidents: IncidentEntity[] = await this.service.findIncidentsByStatus(status);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incidents',
      req.user,
      'incident',
      {
        activeTab: status,
        incidents: incidents,
        showContent: incidents.length > 0,
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}, {filePath: '/styles/incidents.css'}],
      }
    );
  }

}