import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ListUserResponseDTO } from './dto/response/list-user-response.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  public async listUserByID(@Param('id', ParseIntPipe) id: number): Promise<ListUserResponseDTO> {
    const user: UserEntity = await this.userService.findUserByIDOrCry(id);
    
    return new ListUserResponseDTO(user);
  }

}
