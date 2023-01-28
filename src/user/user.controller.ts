import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PermissionEnum } from 'src/app/enum/permission.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import PermissionGuard from 'src/auth/guard/permission.guard';
import { ListUserResponseDTO } from './dto/response/list-user-response.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.LIST_USER)
  )
  public async listUserByID(@Param('id', ParseIntPipe) id: number): Promise<ListUserResponseDTO> {
    const user: UserEntity = await this.userService.findUserByIDOrCry(id);
    
    return new ListUserResponseDTO(user);
  }

}
