import { Controller, Get, UseFilters, UseGuards, Request, Res, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Response } from 'express';
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { ApiExcludeController } from "@nestjs/swagger";
import { DashboardItemService } from "../service/dashboard-item.service";
import { ItemEntity } from "src/item/entity/item.entity";
import { LocationEntity } from "src/location/entity/location.entity";
import { CreateItemRequestDTO } from "src/item/dto/request/create-item-request.dto";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { UpdateItemRequestDTO } from "src/item/dto/request/update-item-request.dto";
import { Roles } from "src/auth/roles/require-roles.decorator";
import { RoleEnum } from "src/app/enum/role.enum";
import { ListItemsResponseDTO } from "src/item/dto/response/list-items-response.dto";
import { RolesGuard } from "src/auth/guard/roles.guard";

@Controller('dashboard/item')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardItemController {
  
  constructor(private readonly service: DashboardItemService) {}

  @Get('create')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getCreateItemPage(@Request() req, @Res() res: Response): Promise<void> {  
    const locations: LocationEntity[] = await this.service.findLocations();
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'item/create-item',
      req.user,
      'item',
      {
        locations: locations,
        item: new CreateItemRequestDTO(),
        uri: '/dashboard/item/create',
      }
    );
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getItemPage(@Param('id', ParseIntPipe) itemId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const locations: LocationEntity[] = await this.service.findLocations();
    const item: ItemEntity = await this.service.findItemByIDOrCry(itemId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'item/create-item',
      req.user,
      'item',
      {
        locations: locations,
        item: CreateItemRequestDTO.fromEntity(item),
        uri: '/dashboard/item/update',
      }
    );
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getItemsPage(@Request() req, @Res() res: Response): Promise<void> {
    const items: ItemEntity[] = await this.service.findItems();
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'item/items',
      req.user,
      'item',
      {
        items: items,
        showContent: items.length > 0,
      },
    );
  }

  @Post('create')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async createItem(@Request() req, @Res() res: Response): Promise<void> { 
    const createItemRequestDTO: CreateItemRequestDTO = CreateItemRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.createItem(createItemRequestDTO);
    } catch (errors) {
      const locations: LocationEntity[] = await this.service.findLocations();

      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'item/create-item',
        req.user,
        'item',
        {
          locations: locations,
          item: createItemRequestDTO,
          uri: '/dashboard/item/create',
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/item');
  }

  @Post('update')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async updateItem(@Request() req, @Res() res: Response): Promise<void> { 
    const updateItemRequestDTO: UpdateItemRequestDTO = UpdateItemRequestDTO.fromDashboard(req.body);

    try {
      await this.service.updateItem(updateItemRequestDTO);
    } catch (errors) {
      const locations: LocationEntity[] = await this.service.findLocations();

      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'item/create-item',
        req.user,
        'item',
        {
          locations: locations,
          item: updateItemRequestDTO,
          uri: '/dashboard/item/update',
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/item');
  }

  @Get('delete/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async deleteItem(@Param('id', ParseIntPipe) itemId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteItem(itemId);

    return res.redirect('/dashboard/item');
  }

  @Get('location/:id')
  public async listItemsByLocationID(@Param('id', ParseIntPipe) locationId: number): Promise<ListItemsResponseDTO> {
    const items: ItemEntity[] = await this.service.findItemsByLocationID(locationId);
    
    return new ListItemsResponseDTO(items);
  }

}