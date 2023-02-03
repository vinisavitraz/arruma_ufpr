import { Controller, Get, UseFilters, UseGuards, Request, Res, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Response } from 'express';
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { ApiExcludeController } from "@nestjs/swagger";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";
import { DashboardIncidentService } from "../service/dashboard-incident.service";
import { CreateIncidentTypeRequestDTO } from "src/incident/dto/request/create-incident-type-request.dto";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { UpdateIncidentTypeRequestDTO } from "src/incident/dto/request/update-incident-type-request.dto";
import { Roles } from "src/auth/roles/require-roles.decorator";
import { RoleEnum } from "src/app/enum/role.enum";

@Controller('dashboard/incident')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardIncidentController {
  
  constructor(private readonly service: DashboardIncidentService) {}

  @Get('create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async getCreateIncidentPage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident',
      req.user,
      'incident',
    );
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async getIncidentsPage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incidents',
      req.user,
      'incident',
    );
  }

  @Get('types')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async getIncidentTypesPage(@Request() req, @Res() res: Response): Promise<void> {    
    const incidents: IncidentTypeEntity[] = await this.service.findIncidentTypes();

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incident-types',
      req.user,
      'incidentType',
      {
        locations: incidents,
        showContent: incidents.length > 0,
      }
    );
  }

  @Get('types/create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async getCreateIncidentTypePage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident-type',
      req.user,
      'incidentType',
      {
        location: new CreateIncidentTypeRequestDTO(),
        uri: '/dashboard/incident/types/create',
      },
    );
  }

  @Get('types/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async getIncidentTypePage(@Param('id', ParseIntPipe) incidentTypeId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const incidentType: IncidentTypeEntity = await this.service.findIncidentTypeByIDOrCry(incidentTypeId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident-type',
      req.user,
      'incidentType',
      {
        location: CreateIncidentTypeRequestDTO.fromEntity(incidentType),
        uri: '/dashboard/incident/types/update',
      }
    );
  }

  @Post('types/create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async createIncidentType(@Request() req, @Res() res: Response): Promise<void> { 
    const createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO = CreateIncidentTypeRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.createIncidentType(createIncidentTypeRequestDTO);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'incident/create-incident-type',
        req.user,
        'incidentType',
        {
          location: createIncidentTypeRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/incident/types');
  }

  @Post('types/update')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async updateIncidentType(@Request() req, @Res() res: Response): Promise<void> { 
    const updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO = UpdateIncidentTypeRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.updateIncidentType(updateIncidentTypeRequestDTO);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'incident/create-incident-type',
        req.user,
        'incidentType',
        {
          location: updateIncidentTypeRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/incident/types');
  }

  @Get('types/delete/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async deleteIncidentType(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteIncidentType(locationId);

    return res.redirect('/dashboard/incident/types');
  }

}