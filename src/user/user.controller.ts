import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { UserEmailNotFoundExample } from 'src/app/docs/example/user/user-email-not-found-example';
import { UserNotFoundExample } from 'src/app/docs/example/user/user-not-found-example';
import { RoleEnum } from 'src/app/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles/require-roles.decorator';
import { ForgotPasswordRequestDTO } from 'src/dashboard/dto/request/forgot-password-request.dto';
import { CreateUserRequestDTO } from './dto/request/create-user-request.dto';
import { ResetUserPasswordRequestDTO } from './dto/request/reset-user-password-request.dto';
import { UpdateUserRequestDTO } from './dto/request/update-user-request.dto';
import { DeleteUserResponseDTO } from './dto/response/delete-user-response.dto';
import { ListUserResponseDTO } from './dto/response/list-user-response.dto';
import { ListUsersResponseDTO } from './dto/response/list-users-response.dto';
import { RequestResetPasswordResponseDTO } from './dto/response/request-reset-password-response.dto';
import { UpdatePasswordResponseDTO } from './dto/response/update-password-response.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiHeader({name: 'Authorization'})
@Controller('user')
@ApiTags('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar usuário pelo ID' })
  @ApiOkResponse({ type: ListUserResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listUserByID(@Param('id', ParseIntPipe) id: number): Promise<ListUserResponseDTO> {
    const user: UserEntity = await this.userService.findUserByIDOrCry(id);
    
    return new ListUserResponseDTO(user);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiOkResponse({ type: ListUsersResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listUsers(): Promise<ListUsersResponseDTO> {
    const users: UserEntity[] = await this.userService.findUsers();
    
    return new ListUsersResponseDTO(users);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Solicitar reset de senha do usuário' })
  @ApiBody({ type: ForgotPasswordRequestDTO })
  @ApiOkResponse({ type: RequestResetPasswordResponseDTO })
  @ApiNotFoundResponse({type: UserEmailNotFoundExample})
  public async requestResetPassword(@Request() req, @Body() forgotPasswordRequestDTO: ForgotPasswordRequestDTO): Promise<RequestResetPasswordResponseDTO> {
    const host: string = req.protocol + '://' + req.get('host');

    await this.userService.sendResetUserPasswordMail(host, forgotPasswordRequestDTO.email);
    
    return new RequestResetPasswordResponseDTO('deliveredOnMail');
  }

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiBody({ type: CreateUserRequestDTO })
  @ApiOkResponse({ type: ListUserResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async createUser(@Request() req, @Body() createUserRequestDTO: CreateUserRequestDTO): Promise<ListUserResponseDTO> {
    const host: string = req.protocol + '://' + req.get('host');

    const user: UserEntity = await this.userService.createUser(host, createUserRequestDTO);
    
    return new ListUserResponseDTO(user);
  }

  @Put('password')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar senha do usuário' })
  @ApiBody({ type: ResetUserPasswordRequestDTO })
  @ApiOkResponse({ type: UpdatePasswordResponseDTO })
  @ApiNotFoundResponse({type: UserNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async updatedUserPassword(@Body() resetUserPasswordRequestDTO: ResetUserPasswordRequestDTO): Promise<UpdatePasswordResponseDTO> {
    await this.userService.changeUserPassword(resetUserPasswordRequestDTO);
    
    return new UpdatePasswordResponseDTO('updated');
  }

  @Put()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiBody({ type: UpdateUserRequestDTO })
  @ApiOkResponse({ type: ListUserResponseDTO })
  @ApiNotFoundResponse({type: UserNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async updateUser(@Body() updateUserRequestDTO: UpdateUserRequestDTO): Promise<ListUserResponseDTO> {
    const user: UserEntity = await this.userService.updateUser(updateUserRequestDTO);
    
    return new ListUserResponseDTO(user);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiOkResponse({ type: DeleteUserResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<DeleteUserResponseDTO> {
    await this.userService.deleteUser(id);
    
    return new DeleteUserResponseDTO('DELETED');
  }

}
