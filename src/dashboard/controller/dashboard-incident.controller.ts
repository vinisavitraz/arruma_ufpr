import { Controller, Get, UseFilters, UseGuards, Request, Res } from "@nestjs/common";
import { Response } from 'express';
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { DashboardService } from "../dashboard.service";

@Controller('dashboard/incident')
@UseFilters(DashboardExceptionFilter)
export class DashboardIncidentController {
  
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  public async getIncidentsPage(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('incident/incidents', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('create')
  public async getCreateIncidentPage(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('incident/create-incident', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('types')
  public async getIncidentTypesPage(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('incident/incident-types', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('types/create')
  public async getCreateIncidentTypePage(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('incident/create-incident-type', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

}