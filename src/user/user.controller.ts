import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { PermissionEnum } from 'src/app/enum/permission.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import PermissionGuard from 'src/auth/guard/permission.guard';
import { ListUserResponseDTO } from './dto/response/list-user-response.dto';
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
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.LIST_USER)
  )
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listUserByID(@Param('id', ParseIntPipe) id: number): Promise<ListUserResponseDTO> {
    const user: UserEntity = await this.userService.findUserByIDOrCry(id);
    
    return new ListUserResponseDTO(user);
  }

}
