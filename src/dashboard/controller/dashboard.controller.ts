import { Controller, Get, Post, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { DashboardService } from '../dashboard.service';
import { Response } from 'express';
import { DashboardExceptionFilter } from 'src/app/exception/filter/dashboard-exception-filter';
import { DashboardAuthGuard } from 'src/auth/guard/dashboard-auth.guard';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { AuthGuard } from '@nestjs/passport';
import { HeaderPermissionsResponseDTO } from '../dto/response/header-permissions-response.dto';
import { AuthenticatedUserEntity } from 'src/user/entity/authenticated-user.entity';

@Controller('dashboard')
@UseFilters(DashboardExceptionFilter)
export class DashboardController {
  
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('login')
  public async getLoginPage(@Res() res: Response): Promise<void> {    
    
    return res.render('login/login', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/login.css'}],
    });
  }

  @UseGuards(AuthGuard('local'), DashboardAuthGuard)
  @Post('login')
  public async login(@Request() req, @Res() res: Response): Promise<void> {    
    res.redirect('/dashboard');
    return;
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

  @UseGuards(AuthenticatedGuard)
  @Get()
  public async getHomePage(@Request() req, @Res() res: Response): Promise<void> {
    const user: AuthenticatedUserEntity = req.user;
    const headerPermissions: HeaderPermissionsResponseDTO = this.dashboardService.buildHeaderPermissionsByUser(user);
    
    return res.render('home/home', { 
      headerPermissions: headerPermissions,
      user: user,
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('unauthorized')
  public async getUnauthorizedPage(@Request() req, @Res() res: Response): Promise<void> {
    const user = req.user;

    return res.render('app/unauthorized', { 
      user: user,
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

}
