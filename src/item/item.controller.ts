import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { ItemNotFoundExample } from 'src/app/docs/example/item/item-not-found-example';
import { RoleEnum } from 'src/app/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles/require-roles.decorator';
import { CreateItemRequestDTO } from './dto/request/create-item-request.dto';
import { UpdateItemRequestDTO } from './dto/request/update-item-request.dto';
import { DeleteItemResponseDTO } from './dto/response/delete-item-response.dto';
import { ListItemResponseDTO } from './dto/response/list-item-response.dto';
import { ListItemsResponseDTO } from './dto/response/list-items-response.dto';
import { ItemEntity } from './entity/item.entity';
import { ItemService } from './item.service';

@ApiBearerAuth()
@ApiHeader({name: 'Authorization'})
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
  public async listItems(): Promise<ListItemsResponseDTO> {
    const items: ItemEntity[] = await this.itemService.findItems();
    
    return new ListItemsResponseDTO(items);
  }

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar novo item' })
  @ApiBody({ type: CreateItemRequestDTO })
  @ApiOkResponse({ type: ListItemResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async createItem(@Body() createItemRequestDTO: CreateItemRequestDTO): Promise<ListItemResponseDTO> {
    const item: ItemEntity = await this.itemService.createItem(createItemRequestDTO);
    
    return new ListItemResponseDTO(item);
  }

  @Put()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar item' })
  @ApiBody({ type: UpdateItemRequestDTO })
  @ApiOkResponse({ type: ListItemResponseDTO })
  @ApiNotFoundResponse({type: ItemNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async updateItem(@Body() updateItemRequestDTO: UpdateItemRequestDTO): Promise<ListItemResponseDTO> {
    const item: ItemEntity = await this.itemService.updateItem(updateItemRequestDTO);
    
    return new ListItemResponseDTO(item);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Excluir item' })
  @ApiOkResponse({ type: DeleteItemResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async deleteItem(@Param('id', ParseIntPipe) id: number): Promise<DeleteItemResponseDTO> {
    await this.itemService.deleteItem(id);
    
    return new DeleteItemResponseDTO('DELETED');
  }
  
}
