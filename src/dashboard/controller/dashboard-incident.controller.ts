import { Controller, Get, UseFilters, UseGuards, Request, Res } from "@nestjs/common";
import { Response } from 'express';
import { PermissionEnum } from "src/app/enum/permission.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import PermissionGuard from "src/auth/guard/permission.guard";
import { DashboardService } from "../service/dashboard.service";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { ApiExcludeController } from "@nestjs/swagger";

@Controller('dashboard/incident')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardIncidentController {
  
  constructor(private readonly dashboardService: DashboardService) {}

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
    PermissionGuard(PermissionEnum.INCIDENT_TYPES_PAGE),
  )
  @Get('types')
  public async getIncidentTypesPage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'incident/incident-types',
      req.user,
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
    );
  }

}