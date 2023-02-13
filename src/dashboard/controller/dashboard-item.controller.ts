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
import { UserEntity } from "src/user/entity/user.entity";
import { ItemsPageContent } from "../content/items-page.content";
import { DashboardPagination } from "../pagination/dashboard-pagination";
import { QueryStringBuilder } from "src/app/util/query-string.builder";

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
    const itemsPageContent: ItemsPageContent = ItemsPageContent.fromQueryParams(req.query);
    const items: ItemEntity[] = await this.service.searchItems(itemsPageContent);
    itemsPageContent.total = await this.service.findTotalItems();

    return this.renderItemsPage(
      res, 
      req.user, 
      items,  
      '/dashboard/item', 
      itemsPageContent,
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

  @Post('search')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async searchItems(@Request() req, @Res() res: Response): Promise<void> { 
    const itemsPageContent: ItemsPageContent = ItemsPageContent.fromSearch(req.body);
    const url: string = QueryStringBuilder.build(
      itemsPageContent, 
      itemsPageContent.maxPerPage, 
      '/dashboard/item',
      0,
      true
    );

    return res.redirect(url);
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

  private async renderItemsPage(
    @Res() res: Response, 
    user: UserEntity,
    items: ItemEntity[],
    uri: string,
    itemsPageContent: ItemsPageContent,
  ): Promise<void> {
    const locations: LocationEntity[] = await this.service.findLocations();
    const pagination: DashboardPagination = DashboardPagination.build(
      itemsPageContent, 
      uri,
    );
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'item/items',
      user,
      'item',
      {
        pagination: pagination,
        classSearchForm: itemsPageContent.searching ? 'd-block' : 'd-none',
        classSearchButton: itemsPageContent.searching ? 'd-none' : 'd-block',
        content: itemsPageContent,
        uri: uri,
        items: items,
        locations: locations,
        showContent: items.length > 0,
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/search-form.js'}, {filePath: '/js/filter-tables.js'}],
      }
    );
  }

}