import { Controller, Get, Post, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Response } from 'express';
import { DashboardExceptionFilter } from 'src/app/exception/filter/dashboard-exception-filter';
import { DashboardAuthGuard } from 'src/auth/guard/dashboard-auth.guard';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';

@Controller('dashboard')
@UseFilters(DashboardExceptionFilter)
export class DashboardController {
  
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('')
  public async getHomePage(@Request() req, @Res() res: Response): Promise<void> {
    const user = req.user;

    return res.render('home/home', { 
      user: user,
    });
  }

  @Get('login')
  public async getLoginPage(@Res() res: Response): Promise<void> {    
    
    return res.render('login/login', {});
  }

  @UseGuards(DashboardAuthGuard)
  @Post('login')
  public async login(@Request() req, @Res() res: Response): Promise<void> {    
    //const response: AuthResponseDto = await this.authService.auth(req.user, AuthOrigin.DASHBOARD);

    //if (response.status === AuthResponse.AUTHENTICATED) {
      res.redirect('/dashboard');
      return;
    //}
    
    // req.logout();

    // const errorMessage = response.status === AuthResponse.ERROR ? response.code : 'Error on login. Try again later.';

    // return res.render('login/login', { 
    //   error: true,
    //   errorMessage: errorMessage
    // });
  }

}
