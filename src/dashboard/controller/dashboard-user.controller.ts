import { Controller, Get, UseFilters, UseGuards, Request, Res, Post, Param, ParseIntPipe } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from 'express';
import { RoleEnum } from "src/app/enum/role.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { QueryStringBuilder } from "src/app/util/query-string.builder";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/roles/require-roles.decorator";
import { ResetUserPasswordRequestDTO } from "src/user/dto/request/reset-user-password-request.dto";
import { CreateUserRequestDTO } from "src/user/dto/request/create-user-request.dto";
import { UpdateUserRequestDTO } from "src/user/dto/request/update-user-request.dto";
import { UserEntity } from "src/user/entity/user.entity";
import { UsersPageContent } from "../content/users-page.content";
import { DashboardPagination } from "../pagination/dashboard-pagination";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { DashboardUserService } from "../service/dashboard-user.service";

@Controller('dashboard/user')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardUserController {
  
  constructor(private readonly service: DashboardUserService) {}

  @Get('create')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getCreateUserPage(@Request() req, @Res() res: Response): Promise<void> {    

    return this.renderCreateUserPage(
      res, 
      req.user, 
      new CreateUserRequestDTO(),
      '/dashboard/user/create',
      'user',
    );
  }

  @Get('change-password')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getChangePasswordPage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'user/change-password',
      req.user,
      'user-change-password',
      {
        passwordForm: new ResetUserPasswordRequestDTO(),
      },
    );
  }

  @Get('profile')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getProfilePage(@Request() req, @Res() res: Response): Promise<void> {     
    const user: UserEntity = await this.service.findUserByIDOrCry(req.user.id);

    return this.renderCreateUserPage(
      res, 
      req.user, 
      CreateUserRequestDTO.fromEntity(user),
      '/dashboard/user/update-profile',
      'user-profile',
    );
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getUserPage(@Param('id', ParseIntPipe) userId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const user: UserEntity = await this.service.findUserByIDOrCry(userId);
    
    return this.renderCreateUserPage(
      res, 
      req.user, 
      CreateUserRequestDTO.fromEntity(user),
      '/dashboard/user/update',
      'user',
    );
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getUsersPage(@Request() req, @Res() res: Response): Promise<void> {    
    const usersPageContent: UsersPageContent = UsersPageContent.fromQueryParams(req.query);
    const users: UserEntity[] = await this.service.searchUsers(usersPageContent);
    usersPageContent.total = await this.service.findTotalUsers();
    
    return this.renderUsersPage(
      res, 
      req.user, 
      users,  
      '/dashboard/user', 
      usersPageContent,
    );
  }

  @Post('create')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async createUser(@Request() req, @Res() res: Response): Promise<void> { 
    const host: string = req.protocol + '://' + req.get('host');
    const createUserRequestDTO: CreateUserRequestDTO = CreateUserRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.createUser(host, createUserRequestDTO);
    } catch (error) {
      return this.renderCreateUserPage(
        res, 
        req.user, 
        createUserRequestDTO,
        '/dashboard/user/create',
        'user',
        error,
      );
    }  

    return res.redirect('/dashboard/user');
  }

  @Post('update')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async updateUser(@Request() req, @Res() res: Response): Promise<void> { 
    const updateUserRequestDTO: UpdateUserRequestDTO = UpdateUserRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.updateUser(updateUserRequestDTO);
    } catch (error) {
      return this.renderCreateUserPage(
        res, 
        req.user, 
        updateUserRequestDTO,
        '/dashboard/user/update',
        'user',
        error,
      );
    }  

    return res.redirect('/dashboard/user');
  }

  @Post('update-profile')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async updateUserProfile(@Request() req, @Res() res: Response): Promise<void> { 
    const updateUserRequestDTO: UpdateUserRequestDTO = UpdateUserRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.updateUser(updateUserRequestDTO);
    } catch (error) {
      return this.renderCreateUserPage(
        res, 
        req.user, 
        updateUserRequestDTO,
        '/dashboard/user/update-profile',
        'user-profile',
        error,
      );
    }  

    return res.redirect('/dashboard');
  }

  @Post('change-password')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async changeUserPassword(@Request() req, @Res() res: Response): Promise<void> { 
    const changeUserPasswordRequestDTO: ResetUserPasswordRequestDTO = ResetUserPasswordRequestDTO.fromDashboard(req.body);

    try {
      await this.service.changeUserPassword(changeUserPasswordRequestDTO);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'user/change-password',
        req.user,
        'user-change-password',
        {
          passwordForm: changeUserPasswordRequestDTO,
          ...DashboardErrorMapper.mapValidationErrors(errors),
        }
      );
    }

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'user/change-password',
      req.user,
      'user-change-password',
      {
        passwordForm: new ResetUserPasswordRequestDTO(),
        showSuccess: true,
      }
    );
  }

  @Post('search')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async searchUsers(@Request() req, @Res() res: Response): Promise<void> { 
    const usersPageContent: UsersPageContent = UsersPageContent.fromSearch(req.body);
    const url: string = QueryStringBuilder.build(
      usersPageContent, 
      usersPageContent.maxPerPage, 
      '/dashboard/user',
      0,
      true
    );

    return res.redirect(url);
  }

  @Get('delete/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async deleteUser(@Param('id', ParseIntPipe) userId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteUser(userId);

    return res.redirect('/dashboard/user');
  }

  private async renderUsersPage(
    @Res() res: Response, 
    user: UserEntity,
    users: UserEntity[],
    uri: string,
    incidentTypePageContent: UsersPageContent,
  ): Promise<void> {
    const pagination: DashboardPagination = DashboardPagination.build(
      incidentTypePageContent, 
      uri,
    );
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'user/users',
      user,
      'user',
      {
        pagination: pagination,
        classSearchForm: incidentTypePageContent.searching ? 'd-block' : 'd-none',
        classSearchButton: incidentTypePageContent.searching ? 'd-none' : 'd-block',
        content: incidentTypePageContent,
        uri: uri,
        users: users,
        showContent: users.length > 0,
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/search-form.js'}, {filePath: '/js/filter-tables.js'}],
      }
    );
  }

  private async renderCreateUserPage(
    @Res() res: Response, 
    user: UserEntity,
    userForm: CreateUserRequestDTO | UpdateUserRequestDTO,
    uri: string,
    module: string,
    error: any = null
  ): Promise<void> {
    let title: string = 'Usuário';
    let description: string = 'Usuário ou Administrador do sistema.';
    let backUrl: string = '/dashboard/user';

    if (module === 'user-profile') {
      title = 'Meu perfil';
      description = 'Alterar dados da conta';
      backUrl = '/dashboard';
    }

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'user/create-user',
      user,
      module,
      {
        jsScripts: [{filePath: '/js/user-form.js'}],
        userForm: userForm,
        uri: uri,
        ...DashboardErrorMapper.mapValidationErrors(error),
        title: title,
        description: description,
        backUrl: backUrl,
      },
    );
  }

}