import { Controller, Get, UseFilters, UseGuards, Request, Res } from "@nestjs/common";
import { Response } from 'express';
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { DashboardService } from "../dashboard.service";

@Controller('dashboard/location')
@UseFilters(DashboardExceptionFilter)
export class DashboardLocationController {
  
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  public async getLocationsPage(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('location/locations', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('create')
  public async getCreateLocationPage(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('location/create-location', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

}