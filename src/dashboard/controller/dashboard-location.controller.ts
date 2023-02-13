import { Controller, Get, UseFilters, UseGuards, Request, Res, Post, Param, ParseIntPipe } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from 'express';
import { RoleEnum } from "src/app/enum/role.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { QueryStringBuilder } from "src/app/util/query-string.builder";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/roles/require-roles.decorator";
import { CreateLocationRequestDTO } from "src/location/dto/request/create-location-request.dto";
import { UpdateLocationRequestDTO } from "src/location/dto/request/update-location-request.dto";
import { LocationEntity } from "src/location/entity/location.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { LocationsPageContent } from "../content/locations-page.content";
import { DashboardPagination } from "../pagination/dashboard-pagination";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { DashboardLocationService } from "../service/dashboard-location.service";

@Controller('dashboard/location')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardLocationController {
  
  constructor(private readonly service: DashboardLocationService) {}

  @Get('create')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getCreateLocationPage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'location/create-location',
      req.user,
      'location',
      {
        location: new CreateLocationRequestDTO(),
        uri: '/dashboard/location/create',
      },
    );
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getLocationPage(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const location: LocationEntity = await this.service.findLocationByIDOrCry(locationId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'location/create-location',
      req.user,
      'location',
      {
        location: CreateLocationRequestDTO.fromEntity(location),
        uri: '/dashboard/location/update',
      }
    );
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async getLocationsPage(@Request() req, @Res() res: Response): Promise<void> {    
    const locationsPageContent: LocationsPageContent = LocationsPageContent.fromQueryParams(req.query);
    const locations: LocationEntity[] = await this.service.searchLocations(locationsPageContent);
    locationsPageContent.total = await this.service.findTotalLocations();

    return this.renderLocationsPage(
      res, 
      req.user, 
      locations,  
      '/dashboard/location', 
      locationsPageContent,
    );
  }

  @Post('create')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async createLocation(@Request() req, @Res() res: Response): Promise<void> { 
    const createLocationRequestDto: CreateLocationRequestDTO = CreateLocationRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.createLocation(createLocationRequestDto);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'location/create-location',
        req.user,
        'location',
        {
          location: createLocationRequestDto,
          ...DashboardErrorMapper.mapValidationErrors(errors)
        }
      );
    }  

    return res.redirect('/dashboard/location');
  }

  @Post('update')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async updateLocation(@Request() req, @Res() res: Response): Promise<void> { 
    const updateLocationRequestDTO: UpdateLocationRequestDTO = UpdateLocationRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.updateLocation(updateLocationRequestDTO);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'location/create-location',
        req.user,
        'location',
        {
          location: updateLocationRequestDTO,
          ...DashboardErrorMapper.mapValidationErrors(errors)
        }
      );
    }  

    return res.redirect('/dashboard/location');
  }

  @Post('search')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async searchLocations(@Request() req, @Res() res: Response): Promise<void> { 
    const locationsPageContent: LocationsPageContent = LocationsPageContent.fromSearch(req.body);
    const url: string = QueryStringBuilder.build(
      locationsPageContent, 
      locationsPageContent.maxPerPage, 
      '/dashboard/location',
      0,
      true
    );

    return res.redirect(url);
  }

  @Get('delete/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async deleteLocation(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteLocation(locationId);

    return res.redirect('/dashboard/location');
  }

  private async renderLocationsPage(
    @Res() res: Response, 
    user: UserEntity,
    locations: LocationEntity[],
    uri: string,
    locationsPageContent: LocationsPageContent,
  ): Promise<void> {
    const pagination: DashboardPagination = DashboardPagination.build(
      locationsPageContent, 
      uri,
    );
    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'location/locations',
      user,
      'location',
      {
        pagination: pagination,
        classSearchForm: locationsPageContent.searching ? 'd-block' : 'd-none',
        classSearchButton: locationsPageContent.searching ? 'd-none' : 'd-block',
        content: locationsPageContent,
        uri: uri,
        locations: locations,
        showContent: locations.length > 0,
        cssImports: [{filePath: '/styles/style.css'}, {filePath: '/styles/header.css'}],
        jsScripts: [{filePath: '/js/header.js'}, {filePath: '/js/search-form.js'}, {filePath: '/js/filter-tables.js'}],
      }
    );
  }

}