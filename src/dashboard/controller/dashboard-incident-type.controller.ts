import { Controller, Get, UseFilters, UseGuards, Request, Res, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Response } from 'express';
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { ApiExcludeController } from "@nestjs/swagger";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";
import { CreateIncidentTypeRequestDTO } from "src/incident/dto/request/create-incident-type-request.dto";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { UpdateIncidentTypeRequestDTO } from "src/incident/dto/request/update-incident-type-request.dto";
import { Roles } from "src/auth/roles/require-roles.decorator";
import { RoleEnum } from "src/app/enum/role.enum";
import { DashboardIncidentTypeService } from "../service/dashboard-incident-type.service";

@Controller('dashboard/incident/type')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardIncidentTypeController {
  
  constructor(private readonly service: DashboardIncidentTypeService) {}

  @Get('create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async getCreateIncidentTypePage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident-type',
      req.user,
      'incidentType',
      {
        incidentType: new CreateIncidentTypeRequestDTO(),
        uri: '/dashboard/incident/type/create',
      },
    );
  }

  @Post('create')
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
          incidentType: createIncidentTypeRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/incident/type');
  }

  @Post('update')
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
          incidentType: updateIncidentTypeRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/incident/type');
  }

  @Get(':id')
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
        incidentType: CreateIncidentTypeRequestDTO.fromEntity(incidentType),
        uri: '/dashboard/incident/type/update',
      }
    );
  }

  @Get('delete/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async deleteIncidentType(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteIncidentType(locationId);

    return res.redirect('/dashboard/incident/type');
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async getIncidentTypesPage(@Request() req, @Res() res: Response): Promise<void> {   
    console.log('getIncidentTypesPage');
    const incidentTypes: IncidentTypeEntity[] = await this.service.findIncidentTypes();
    console.log(incidentTypes);
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incident-types',
      req.user,
      'incidentType',
      {
        incidentTypes: incidentTypes,
        showContent: incidentTypes.length > 0,
      }
    );
  }

}