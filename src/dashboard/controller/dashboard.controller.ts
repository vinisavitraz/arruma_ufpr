import { Controller, Get, Post, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { DashboardService } from '../service/dashboard.service';
import { Response } from 'express';
import { DashboardExceptionFilter } from 'src/app/exception/filter/dashboard-exception-filter';
import { DashboardAuthGuard } from 'src/auth/guard/dashboard-auth.guard';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { AuthGuard } from '@nestjs/passport';
import { DashboardResponseRender } from '../render/dashboard-response-render';
import { ApiExcludeController } from '@nestjs/swagger';
import { HomePageResponseDTO } from '../dto/response/home-page-response.dto';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('dashboard')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardController {
  
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('login')
  public async getLoginPage(@Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderWithoutUser(
      res,
      'login/login',
      {
        cssImports: [{filePath: '/styles/login.css'}],
      },
    );
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
    const user: UserEntity = req.user;
    const homePage: HomePageResponseDTO = await this.dashboardService.getHomePageData(user);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'home/home',
      user,
      'home',
      {
        homePage: homePage,
      },
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Get('unauthorized')
  public async getUnauthorizedPage(@Request() req, @Res() res: Response): Promise<void> {
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'app/unauthorized',
      req.user,
      'home',
    );
  }

}
