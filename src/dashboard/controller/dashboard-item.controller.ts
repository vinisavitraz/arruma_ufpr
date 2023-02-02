import { Controller, Get, UseFilters, UseGuards, Request, Res, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Response } from 'express';
import { PermissionEnum } from "src/app/enum/permission.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import PermissionGuard from "src/auth/guard/permission.guard";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { ApiExcludeController } from "@nestjs/swagger";
import { DashboardItemService } from "../service/dashboard-item.service";
import { ItemEntity } from "src/item/entity/item.entity";
import { LocationEntity } from "src/location/entity/location.entity";
import { CreateItemRequestDTO } from "src/item/dto/request/create-item-request.dto";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { UpdateItemRequestDTO } from "src/item/dto/request/update-item-request.dto";

@Controller('dashboard/item')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardItemController {
  
  constructor(private readonly service: DashboardItemService) {}

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.CREATE_ITEM_PAGE),
  )
  @Get('create')
  public async getCreateItemPage(@Request() req, @Res() res: Response): Promise<void> {  
    const locations: LocationEntity[] = await this.service.findLocations();
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'item/create-item',
      req.user,
      {
        locations: locations,
        item: new CreateItemRequestDTO(),
        uri: '/dashboard/item/create',
      }
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.ITEMS_PAGE),
  )
  @Get(':id')
  public async getItemPage(@Param('id', ParseIntPipe) itemId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const locations: LocationEntity[] = await this.service.findLocations();
    const item: ItemEntity = await this.service.findItemByIDOrCry(itemId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'item/create-item',
      req.user,
      {
        locations: locations,
        item: CreateItemRequestDTO.fromEntity(item),
        uri: '/dashboard/item/update',
      }
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.ITEMS_PAGE),
  )
  @Get()
  public async getItemsPage(@Request() req, @Res() res: Response): Promise<void> {
    const items: ItemEntity[] = await this.service.findItems();
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'item/items',
      req.user,
      {
        items: items,
        showContent: items.length > 0,
      },
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.CREATE_ITEM_PAGE),
  )
  @Post('create')
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

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.UPDATE_ITEM_PAGE),
  )
  @Post('update')
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

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.DELETE_ITEM_PAGE),
  )
  @Get('delete/:id')
  public async deleteItem(@Param('id', ParseIntPipe) itemId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteItem(itemId);

    return res.redirect('/dashboard/item');
  }

}