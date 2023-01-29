import { Controller, Get, UseFilters, UseGuards, Request, Res } from "@nestjs/common";
import { Response } from 'express';
import { PermissionEnum } from "src/app/enum/permission.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import PermissionGuard from "src/auth/guard/permission.guard";
import { DashboardService } from "../dashboard.service";

@Controller('dashboard/item')
@UseFilters(DashboardExceptionFilter)
export class DashboardObjectController {
  
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.ITEMS_PAGE),
  )
  @Get()
  public async getItemsPage(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('item/items', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.CREATE_ITEM_PAGE),
  )
  @Get('create')
  public async getCreateItemPage(@Request() req, @Res() res: Response): Promise<void> {    
    
    return res.render('item/create-item', {
      cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
      jsScripts: [{filePath: '/js/header.js'}],
    });
  }

}