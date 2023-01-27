import { Controller, Get, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Response } from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('login')
  public async getLoginPage(@Res() res: Response): Promise<void> {    
    
    return res.render('login/login', {});
  }

}
