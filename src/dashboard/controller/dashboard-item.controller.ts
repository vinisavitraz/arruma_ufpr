import { Controller, Get, UseFilters, UseGuards, Request, Res } from "@nestjs/common";
import { Response } from 'express';
import { PermissionEnum } from "src/app/enum/permission.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import PermissionGuard from "src/auth/guard/permission.guard";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { ApiExcludeController } from "@nestjs/swagger";
import { DashboardItemService } from "../service/dashboard-item.service";
import { ItemEntity } from "src/item/entity/item.entity";

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
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'item/create-item',
      req.user,
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

}