import { Controller, Get, UseFilters, UseGuards, Request, Res, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Response } from 'express';
import { PermissionEnum } from "src/app/enum/permission.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import PermissionGuard from "src/auth/guard/permission.guard";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { ApiExcludeController } from "@nestjs/swagger";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";
import { DashboardIncidentService } from "../service/dashboard-incident.service";
import { CreateIncidentTypeRequestDTO } from "src/incident/dto/request/create-incident-type-request.dto";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { UpdateIncidentTypeRequestDTO } from "src/incident/dto/request/update-incident-type-request.dto";

@Controller('dashboard/incident')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardIncidentController {
  
  constructor(private readonly service: DashboardIncidentService) {}

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.CREATE_INCIDENT_PAGE),
  )
  @Get('create')
  public async getCreateIncidentPage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident',
      req.user,
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.INCIDENTS_PAGE),
  )
  @Get()
  public async getIncidentsPage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incidents',
      req.user,
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.INCIDENT_TYPES_PAGE),
  )
  @Get('types')
  public async getIncidentTypesPage(@Request() req, @Res() res: Response): Promise<void> {    
    const incidents: IncidentTypeEntity[] = await this.service.findIncidentTypes();

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incident-types',
      req.user,
      {
        locations: incidents,
        showContent: incidents.length > 0,
      }
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.CREATE_INCIDENT_TYPE_PAGE),
  )
  @Get('types/create')
  public async getCreateIncidentTypePage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident-type',
      req.user,
      {
        location: new CreateIncidentTypeRequestDTO(),
        uri: '/dashboard/incident/types/create',
      },
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.INCIDENTS_PAGE),
  )
  @Get('types/:id')
  public async getIncidentTypePage(@Param('id', ParseIntPipe) incidentTypeId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const incidentType: IncidentTypeEntity = await this.service.findIncidentTypeByIDOrCry(incidentTypeId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident-type',
      req.user,
      {
        location: CreateIncidentTypeRequestDTO.fromEntity(incidentType),
        uri: '/dashboard/incident/types/update',
      }
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.CREATE_INCIDENT_TYPE_PAGE),
  )
  @Post('types/create')
  public async createIncidentType(@Request() req, @Res() res: Response): Promise<void> { 
    const createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO = CreateIncidentTypeRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.createIncidentType(createIncidentTypeRequestDTO);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'incident/create-incident-type',
        req.user,
        {
          location: createIncidentTypeRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/incident/types');
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.UPDATE_INCIDENT_TYPE_PAGE),
  )
  @Post('types/update')
  public async updateIncidentType(@Request() req, @Res() res: Response): Promise<void> { 
    const updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO = UpdateIncidentTypeRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.updateIncidentType(updateIncidentTypeRequestDTO);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'incident/create-incident-type',
        req.user,
        {
          location: updateIncidentTypeRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/incident/types');
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.DELETE_INCIDENT_TYPE_PAGE),
  )
  @Get('types/delete/:id')
  public async deleteLocation(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteIncidentType(locationId);

    return res.redirect('/dashboard/incident/types');
  }

}