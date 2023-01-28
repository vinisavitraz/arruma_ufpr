import { Controller, Get, UseFilters, UseGuards, Request, Res } from "@nestjs/common";
import { Response } from 'express';
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { DashboardService } from "../dashboard.service";

@Controller('dashboard/object')
@UseFilters(DashboardExceptionFilter)
export class DashboardObjectController {
  
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  public async listMarkets(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('object/objects', {});
  }

}