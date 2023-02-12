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
import { RolesGuard } from "src/auth/guard/roles.guard";
import { IncidentTypesPageContent } from "../content/incident-types-page.content";
import { DashboardPagination } from "../pagination/dashboard-pagination";
import { UserEntity } from "src/user/entity/user.entity";
import { QueryStringBuilder } from "src/app/util/query-string.builder";

@Controller('dashboard/incident-type')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardIncidentTypeController {
  
  constructor(private readonly service: DashboardIncidentTypeService) {}

  @Get()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getIncidentTypesPage(@Request() req, @Res() res: Response): Promise<void> {   
    const incidentTypePageContent: IncidentTypesPageContent = IncidentTypesPageContent.fromQueryParams(req.query);
    const incidentTypes: IncidentTypeEntity[] = await this.service.findIncidentTypes(incidentTypePageContent);
    incidentTypePageContent.total = await this.service.findTotalIncidentTypes();

    return this.renderIncidentTypesPage(
      res, 
      req.user, 
      incidentTypes,  
      '/dashboard/incident-type', 
      incidentTypePageContent,
    );
  }
  
  @Get('create')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getCreateIncidentTypePage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident-type',
      req.user,
      'incidentType',
      {
        incidentType: new CreateIncidentTypeRequestDTO(),
        uri: '/dashboard/incident-type/create',
      },
    );
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getIncidentTypePage(@Param('id', ParseIntPipe) incidentTypeId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const incidentType: IncidentTypeEntity = await this.service.findIncidentTypeByIDOrCry(incidentTypeId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident-type',
      req.user,
      'incidentType',
      {
        incidentType: CreateIncidentTypeRequestDTO.fromEntity(incidentType),
        uri: '/dashboard/incident-type/update',
      }
    );
  }

  @Get('delete/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async deleteIncidentType(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteIncidentType(locationId);

    return res.redirect('/dashboard/incident-type');
  }

  @Post('create')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
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

    return res.redirect('/dashboard/incident-type');
  }

  @Post('update')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
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

    return res.redirect('/dashboard/incident-type');
  }

  @Post('search')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async searchIncidents(@Request() req, @Res() res: Response): Promise<void> { 
    const incidentTypesPageContent: IncidentTypesPageContent = IncidentTypesPageContent.fromSearch(req.body);
    const url: string = QueryStringBuilder.build(
      incidentTypesPageContent, 
      incidentTypesPageContent.maxPerPage, 
      '/dashboard/incident-type',
      0,
      true
    );

    return res.redirect(url);
  }

  private async renderIncidentTypesPage(
    @Res() res: Response, 
    user: UserEntity,
    incidentTypes: IncidentTypeEntity[],
    uri: string,
    incidentTypePageContent: IncidentTypesPageContent,
  ): Promise<void> {
    const pagination: DashboardPagination = DashboardPagination.build(
      incidentTypePageContent, 
      uri,
    );
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incident-types',
      user,
      'incidentType',
      {
        pagination: pagination,
        classSearchForm: incidentTypePageContent.searching ? 'd-block' : 'd-none',
        classSearchButton: incidentTypePageContent.searching ? 'd-none' : 'd-block',
        content: incidentTypePageContent,
        uri: uri,
        incidentTypes: incidentTypes,
        showContent: incidentTypes.length > 0,
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}, {filePath: '/styles/incidents.css'}],
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/incident/incident-types.js'}, {filePath: '/js/filter-tables.js'}],
      }
    );
  }

}