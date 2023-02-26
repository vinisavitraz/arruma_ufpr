import { Controller, Get, UseFilters, UseGuards, Request, Res, Param, ParseIntPipe, Post, ConsoleLogger, UseInterceptors, UploadedFile } from "@nestjs/common";
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
import { IncidentsPageContent } from "../content/incidents-page.content";
import { DashboardPagination } from "../pagination/dashboard-pagination";
import { QueryStringBuilder } from "src/app/util/query-string.builder";
import LocalFilesInterceptor from "src/app/interceptor/local-files.interceptor";
import { UpdateIncidentRequestDTO } from "src/incident/dto/request/update-incident-request.dto";

@Controller('dashboard/incident')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardIncidentController {
  
  constructor(
    private readonly service: DashboardIncidentService,
  ) {}

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
        uri: '/dashboard/incident/create?origin=userIncident',
        backUrl: '/dashboard/incident/user',
      }
    );
  }

  @Get('user')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getUserIncidentsPage(@Request() req, @Res() res: Response): Promise<void> { 
    const incidentPageContent: IncidentsPageContent = IncidentsPageContent.fromQueryParams('userIncident', req.query);
    const incidents: IncidentEntity[] = await this.service.findUserIncidentsByStatus(req.user, incidentPageContent);
    
    incidentPageContent.total = await this.service.findTotalIncidentsByStatusAndUser(
      incidentPageContent.incidentStatus,
      req.user.id,
    );
    
    return this.renderIncidentsPage(
      res, 
      req.user, 
      incidents,  
      '/dashboard/incident/user', 
      incidentPageContent,
    );
  }

  @Get('set-rating/:rating/incident/:incidentId')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async setIncidentRating(
    @Param('rating', ParseIntPipe) rating: number, 
    @Param('incidentId', ParseIntPipe) incidentId: number, 
    @Request() req, 
    @Res() res: Response
  ): Promise<void> { 
    const origin: string = req.query.origin ?? '';
    await this.service.setIncidentRating(req.user, incidentId, rating);
    
    return res.redirect('/dashboard/incident/' + incidentId + '?origin=' + origin);
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
  @Roles(RoleEnum.ADMIN)
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

    if (origin === 'userIncident') {
      backUrl = '/dashboard/incident/user';
      view = 'userIncident';
    }

    const user: UserEntity = req.user; 
    const incident: IncidentEntity = await this.service.findUserIncidentByIDOrCry(user, incidentId);
    const incidentInteractions: IncidentInteractionEntity[] = await this.service.findIncidentInteractions(incident.id);
    const incidentTypes: IncidentTypeEntity[] = await this.service.findIncidentTypes();
    const locations: LocationEntity[] = await this.service.findLocations(); 
    const items: ItemEntity[] = await this.service.findItemsByLocationID(incident.locationId);

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
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}, {filePath: '/styles/timeline.css'}, {filePath: '/styles/incident-detail.css'}],
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/incident/incident-detail.js'}],
        showButtonAssign: incident.status === IncidentStatusEnum.OPEN && user.role === RoleEnum.ADMIN,
        showButtonClose: incident.status !== IncidentStatusEnum.CLOSED && user.role === RoleEnum.ADMIN,
        showButtonNewMessage: incident.status !== IncidentStatusEnum.CLOSED,
        showButtonEdit: incident.status !== IncidentStatusEnum.CLOSED && user.role === RoleEnum.ADMIN,
        disableEdit:  incident.status === IncidentStatusEnum.CLOSED || user.role !== RoleEnum.ADMIN,
        incidentTypes: incidentTypes,
        locations: locations,
        items: items,
      }
    );
  }

  @Get('edit/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getEditIncidentPage(@Param('id', ParseIntPipe) incidentId: number, @Request() req, @Res() res: Response): Promise<void> {   
    const origin: string = req.query.origin ?? 'incident';
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
        backUrl: '/dashboard/incident/' + incident.id + '?origin=' + origin,
      }
    );
  }

  @Post('create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @UseInterceptors(LocalFilesInterceptor({
    fieldName: 'image',
    path: '/incidents'
  }))
  public async createIncident(@Request() req, @Res() res: Response, @UploadedFile() image: Express.Multer.File | undefined): Promise<void> { 
    const origin: string = req.query.origin ?? 'incident';
    const createIncidentRequestDTO: CreateIncidentRequestDTO = CreateIncidentRequestDTO.fromDashboard(req.body, req.user);
    
    try {
      const incident: IncidentEntity = await this.service.createIncident(createIncidentRequestDTO, image);

      return res.redirect('/dashboard/incident/' + incident.id + '?origin=' + origin);
    } catch (errors) {
      console.log(errors);
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
          ...DashboardErrorMapper.mapValidationErrors(errors)
        }
      );
    } 
  }

  @Post('interaction')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async addInteractionToIncident(@Request() req, @Res() res: Response): Promise<void> { 
    const origin: string = req.query.origin ?? 'incident';
    const url: string = origin === 'incident' ? '/dashboard/incident' : '/dashboard/incident/user';
    const createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO = CreateIncidentInteractionRequestDTO.fromDashboard(req.body, req.user);

    try {
      await this.service.createIncidentInteraction(req.user, createIncidentInteractionRequestDTO);
    } catch (errors) {
      return res.redirect(url);
    }  

    return res.redirect('/dashboard/incident/' + createIncidentInteractionRequestDTO.incidentId + '?origin=' + origin);
  }

  @Post('search')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async searchIncidents(@Request() req, @Res() res: Response): Promise<void> { 
    const incidentPageContent: IncidentsPageContent = IncidentsPageContent.fromSearch(req.body);
    const uri: string = incidentPageContent.origin === 'incident' ? '/dashboard/incident' : '/dashboard/incident/user';
    const url: string = QueryStringBuilder.build(
      incidentPageContent, 
      incidentPageContent.maxPerPage, 
      uri,
      0,
      true
    );

    return res.redirect(url);
  }

  @Post('update')
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(LocalFilesInterceptor({
    fieldName: 'image',
    path: '/incidents'
  }))
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async updateIncident(@Request() req, @Res() res: Response, @UploadedFile() image: Express.Multer.File | undefined): Promise<void> { 
    const origin: string = req.query.origin ?? 'incident';
    const updateIncidentRequestDTO: UpdateIncidentRequestDTO = UpdateIncidentRequestDTO.fromDashboard(req.body);

    try {
      await this.service.updateIncident(updateIncidentRequestDTO, image);
    } catch (errors) {
      console.log(errors);
      return this.renderCreateIncidentPage(
        res,
        req.user,
        '/dashboard/incident/update',
      );
    }  

    return res.redirect('/dashboard/incident/' + updateIncidentRequestDTO.id + '?origin=' + origin);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getIncidentsPage(@Request() req, @Res() res: Response): Promise<void> { 
    const incidentPageContent: IncidentsPageContent = IncidentsPageContent.fromQueryParams('incident', req.query);
    const incidents: IncidentEntity[] = await this.service.findIncidentsByStatus(incidentPageContent);
    incidentPageContent.total = await this.service.findTotalIncidentsByStatusAndUser(
      incidentPageContent.incidentStatus,
      undefined,
    );
    
    return this.renderIncidentsPage(
      res, 
      req.user, 
      incidents, 
      '/dashboard/incident', 
      incidentPageContent,
    );
  }

  private async renderIncidentsPage(
    @Res() res: Response, 
    user: UserEntity, 
    incidents: IncidentEntity[],
    uri: string,
    incidentPageContent: IncidentsPageContent,
  ): Promise<void> {
    const incidentTypes: IncidentTypeEntity[] = await this.service.findIncidentTypes();
    const locations: LocationEntity[] = await this.service.findLocations();
    const items: ItemEntity[] = await this.service.findItemsByLocationID(incidentPageContent.locationId ?? 0);
    const pageTitle: string = incidentPageContent.origin === 'incident' ? 'Incidentes' : 'Meus incidentes';
    const pagination: DashboardPagination = DashboardPagination.build(
      incidentPageContent, 
      uri,
    );
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incidents',
      user,
      incidentPageContent.origin,
      {
        pagination: pagination,
        classSearchForm: incidentPageContent.searching ? 'd-block' : 'd-none',
        classSearchButton: incidentPageContent.searching ? 'd-none' : 'd-block',
        content: incidentPageContent,
        showCreateIncidentButton: incidentPageContent.origin === 'userIncident',
        pageTitle: pageTitle,
        uri: uri,
        incidentTypes: incidentTypes,
        locations: locations,
        items: items,
        incidents: incidents,
        showContent: incidents.length > 0,
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}, {filePath: '/styles/incidents.css'}],
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/incident/incidents.js'}, {filePath: '/js/filter-tables.js'}, {filePath: '/js/search-form.js'}],
      }
    );
  }

  private async renderCreateIncidentPage(
    @Res() res: Response, 
    user: UserEntity, 
    uri: string,
  ): Promise<void> {
    const incidentTypes: IncidentTypeEntity[] = await this.service.findIncidentTypes();
    const locations: LocationEntity[] = await this.service.findLocations();

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/create-incident',
      user,
      'incident',
      {
        incidentTypes: incidentTypes,
        locations: locations,
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/incident/create-incident.js'}],
        incident: new CreateIncidentRequestDTO(),
        uri: '/dashboard/incident/create?origin=userIncident',
      }
    );
  }

}