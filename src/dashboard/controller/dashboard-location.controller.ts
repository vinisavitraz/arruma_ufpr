import { Controller, Get, UseFilters, UseGuards, Request, Res, Post, Param, ParseIntPipe } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from 'express';
import { PermissionEnum } from "src/app/enum/permission.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import PermissionGuard from "src/auth/guard/permission.guard";
import { CreateLocationRequestDTO } from "src/location/dto/request/create-location-request.dto";
import { UpdateLocationRequestDTO } from "src/location/dto/request/update-location-request.dto";
import { LocationEntity } from "src/location/entity/location.entity";
import { DashboardErrorMapper } from "../render/dashboard-error-mapper";
import { DashboardResponseRender } from "../render/dashboard-response-render";
import { DashboardLocationService } from "../service/dashboard-location.service";

@Controller('dashboard/location')
@ApiExcludeController()
@UseFilters(DashboardExceptionFilter)
export class DashboardLocationController {
  
  constructor(private readonly service: DashboardLocationService) {}

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.CREATE_LOCATION_PAGE),
  )
  @Get('create')
  public async getCreateLocationPage(@Request() req, @Res() res: Response): Promise<void> {    
    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'location/create-location',
      req.user,
      {
        location: new CreateLocationRequestDTO(),
        uri: '/dashboard/location/create',
      },
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.LOCATIONS_PAGE),
  )
  @Get(':id')
  public async getLocationPage(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {    
    const location: LocationEntity = await this.service.findLocationByIDOrCry(locationId);

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'location/create-location',
      req.user,
      {
        location: CreateLocationRequestDTO.fromEntity(location),
        uri: '/dashboard/location/update',
      }
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.LOCATIONS_PAGE),
  )
  @Get()
  public async getLocationsPage(@Request() req, @Res() res: Response): Promise<void> {    
    const locations: LocationEntity[] = await this.service.findLocations();

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'location/locations',
      req.user,
      {
        locations: locations,
        showContent: locations.length > 0,
      },
    );
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.CREATE_LOCATION_PAGE),
  )
  @Post('create')
  public async createLocation(@Request() req, @Res() res: Response): Promise<void> { 
    const createLocationRequestDto: CreateLocationRequestDTO = CreateLocationRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.createLocation(createLocationRequestDto);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'location/create-location',
        req.user,
        {
          location: createLocationRequestDto,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/location');
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.UPDATE_LOCATION_PAGE),
  )
  @Post('update')
  public async updateLocation(@Request() req, @Res() res: Response): Promise<void> { 
    const updateLocationRequestDTO: UpdateLocationRequestDTO = UpdateLocationRequestDTO.fromDashboard(req.body);
    
    try {
      await this.service.updateLocation(updateLocationRequestDTO);
    } catch (errors) {
      return DashboardResponseRender.renderForAuthenticatedUser(
        res,
        'location/create-location',
        req.user,
        {
          location: updateLocationRequestDTO,
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/location');
  }

  @UseGuards(
    AuthenticatedGuard,
    PermissionGuard(PermissionEnum.DELETE_LOCATION_PAGE),
  )
  @Get('delete/:id')
  public async deleteLocation(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteLocation(locationId);

    return res.redirect('/dashboard/location');
  }

}