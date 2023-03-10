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
import { ForgotPasswordRequestDTO } from '../dto/request/forgot-password-request.dto';
import { DashboardErrorMapper } from '../render/dashboard-error-mapper';
import { ResetUserPasswordRequestDTO } from 'src/user/dto/request/reset-user-password-request.dto';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { CreateUserRequestDTO } from 'src/user/dto/request/create-user-request.dto';
import { RegisterUserRequestDTO } from 'src/user/dto/request/register-user-request.dto';

@Controller('dashboard')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardController {
  
  constructor(private readonly service: DashboardService) {}

  @Get('login')
  public async getLoginPage(@Request() req, @Res() res: Response): Promise<void> {    
    const errorCode: string = req.query.errorCode ?? '';
    const mail: string = req.query.mail ?? '';
    
    return DashboardResponseRender.renderWithoutUser(
      res,
      'login/login',
      {
        cssImports: [{filePath: '/styles/login.css'}, {filePath: '/styles/style.css'}],
        userMail: mail,
        ...DashboardErrorMapper.mapValidationErrors(errorCode),
      },
    );
  }

  @Get('register')
  public async getRegisterPage(@Request() req, @Res() res: Response): Promise<void> {   
    return this.renderRegisterPage(
      res,
      new CreateUserRequestDTO(),
    );
  }

  @UseGuards(AuthGuard('local'), DashboardAuthGuard)
  @Post('login')
  public async login(@Request() req, @Res() res: Response): Promise<void> {    
    res.redirect('/dashboard');
    return;
  }

  @Post('register')
  public async registerUser(@Request() req, @Res() res: Response): Promise<void> { 
    const host: string = req.protocol + '://' + req.get('host');
    const createUserWithPasswordRequestDTO: RegisterUserRequestDTO = RegisterUserRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.createUser(host, createUserWithPasswordRequestDTO);
    } catch (errors) {
      return this.renderRegisterPage(res, createUserWithPasswordRequestDTO, errors);
    }  

    return res.redirect('/dashboard/login');
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
    const homePage: HomePageResponseDTO = await this.service.getHomePageData(user);

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

  @Get('forgot-password')
  public async getForgotPasswordPage(@Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderWithoutUser(
      res,
      'login/forgot-password',
      {
        cssImports: [{filePath: '/styles/login.css'}, {filePath: '/styles/style.css'}],
      },
    );
  }

  @Get('mail-sent')
  public async getMailSentPage(@Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderWithoutUser(
      res,
      'login/mail-sent',
      {
        cssImports: [{filePath: '/styles/login.css'}, {filePath: '/styles/style.css'}],
      },
    );
  }

  @Get('reset-password')
  public async getResetPasswordPage(@Request() req, @Res() res: Response): Promise<void> {    
    const tokenNumber: string = req.query.token ?? '';

    try {
      const user: UserEntity = await this.service.findUserByRecoverPasswordToken(tokenNumber);
      return DashboardResponseRender.renderWithoutUser(
        res,
        'login/reset-password',
        {
          cssImports: [{filePath: '/styles/login.css'}, {filePath: '/styles/style.css'}],
          user: user,
        }
      );
    } catch (errors) {
      return DashboardResponseRender.renderWithoutUser(
        res,
        'login/reset-password',
        {
          cssImports: [{filePath: '/styles/login.css'}, {filePath: '/styles/style.css'}],
          ...DashboardErrorMapper.mapValidationErrors(errors)
        }
      );
    }
  }

  @Get('password-changed')
  public async passwordChanged(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderWithoutUser(
      res,
      'login/password-changed',
      {
        cssImports: [{filePath: '/styles/login.css'}, {filePath: '/styles/style.css'}],
      }
    );
  }

  @Post('forgot-password')
  public async forgotPassword(@Request() req, @Res() res: Response): Promise<void> {    
    const forgotPasswordRequestDTO: ForgotPasswordRequestDTO = ForgotPasswordRequestDTO.fromDashboard(req.body);
    const host: string = req.protocol + '://' + req.get('host');

    try {
      await this.service.forgotPassword(host, forgotPasswordRequestDTO);
    } catch (errors) {
      const exception: HttpOperationException = errors;
      return DashboardResponseRender.renderWithoutUser(
        res,
        'login/forgot-password',
        {
          cssImports: [{filePath: '/styles/login.css'}, {filePath: '/styles/style.css'}],
          ...DashboardErrorMapper.mapValidationErrors(exception)
        }
      );
    }
    
    res.redirect('/dashboard/mail-sent');
  }

  @Post('reset-password')
  public async resetPassword(@Request() req, @Res() res: Response): Promise<void> {   
    const changeUserPasswordRequestDTO: ResetUserPasswordRequestDTO = ResetUserPasswordRequestDTO.fromDashboard(req.body);

    try {
      await this.service.changeUserPassword(changeUserPasswordRequestDTO);
    } catch (error) {
      const exception: HttpOperationException = error;
      return DashboardResponseRender.renderWithoutUser(
        res,
        'login/reset-password',
        {
          cssImports: [{filePath: '/styles/login.css'}, {filePath: '/styles/style.css'}],
          ...DashboardErrorMapper.mapValidationErrors(exception)
        }
      );
    }

    res.redirect('/dashboard/password-changed');  
  }

  private renderRegisterPage(@Res() res: Response, createUserRequestDTO: CreateUserRequestDTO, error: any = null): void {
    return DashboardResponseRender.renderWithoutUser(
      res,
      'login/register',
      {
        cssImports: [{filePath: '/styles/register.css'}, {filePath: '/styles/style.css'}],
        jsScripts: [{filePath: '/js/user-form.js'}],
        ...DashboardErrorMapper.mapValidationErrors(error),
        user: createUserRequestDTO,
      },
    );
  }

}
