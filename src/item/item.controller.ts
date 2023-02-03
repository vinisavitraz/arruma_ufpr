import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { RoleEnum } from 'src/app/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles/require-roles.decorator';
import { ListItemsResponseDTO } from './dto/response/list-items-response.dto';
import { ItemEntity } from './entity/item.entity';
import { ItemService } from './item.service';

@Controller('item')
@ApiTags('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar items pelo ID do local' })
  @ApiOkResponse({ type: ListItemsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listItemsByLocationID(@Param('id', ParseIntPipe) locationId: number): Promise<ListItemsResponseDTO> {
    const items: ItemEntity[] = await this.itemService.findItemsByLocationID(locationId);
    
    return new ListItemsResponseDTO(items);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os itens' })
  @ApiOkResponse({ type: ListItemsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listLocations(): Promise<ListItemsResponseDTO> {
    const items: ItemEntity[] = await this.itemService.findItems();
    
    return new ListItemsResponseDTO(items);
  }
  
}
