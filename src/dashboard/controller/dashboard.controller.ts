import { Controller, Get, Post, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { DashboardService } from '../dashboard.service';
import { Response } from 'express';
import { DashboardExceptionFilter } from 'src/app/exception/filter/dashboard-exception-filter';
import { DashboardAuthGuard } from 'src/auth/guard/dashboard-auth.guard';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
@UseFilters(DashboardExceptionFilter)
export class DashboardController {
  
  constructor(private readonly dashboardService: DashboardService) {}

  //@UseGuards(AuthenticatedGuard)
  @Get('')
  public async getHomePage(@Request() req, @Res() res: Response): Promise<void> {
    const user = req.user;

    return res.render('home/home', { 
      user: user,
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

  @Get('login')
  public async getLoginPage(@Res() res: Response): Promise<void> {    
    
    return res.render('login/login', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/login.css'}],
    });
  }

  @UseGuards(AuthGuard('local'), DashboardAuthGuard)
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

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  public async logout(@Request() req, @Res() res: Response): Promise<void> {
    req.logout(function(err) {
      if (err) { 
        console.log('Error during logout');
        return;
      }
      res.redirect('/dashboard/login');
    });
    
  }

}
