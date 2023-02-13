import { Controller, Get, UseFilters, UseGuards, Request, Res, Post, Param, ParseIntPipe } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from 'express';
import { RoleEnum } from "src/app/enum/role.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { QueryStringBuilder } from "src/app/util/query-string.builder";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/roles/require-roles.decorator";
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
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'user/create-user',
      req.user,
      'user',
      {
        userForm: new CreateUserRequestDTO(),
        uri: '/dashboard/user/create',
      },
    );
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getUserPage(@Param('id', ParseIntPipe) userId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const user: UserEntity = await this.service.findUserByIDOrCry(userId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'user/create-user',
      req.user,
      'user',
      {
        userForm: CreateUserRequestDTO.fromEntity(user),
        uri: '/dashboard/user/update',
      }
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
    const createUserRequestDTO: CreateUserRequestDTO = CreateUserRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.createUser(createUserRequestDTO);
    } catch (errors) {
      console.log(errors);
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'user/create-user',
        req.user,
        'user',
        {
          user: createUserRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
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
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'user/create-user',
        req.user,
        'user',
        {
          user: updateUserRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/user');
  }

  @Post('search')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
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

}