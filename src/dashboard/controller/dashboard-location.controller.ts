import { Controller, Get, UseFilters, UseGuards, Request, Res, Post, Param, ParseIntPipe } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from 'express';
import { RoleEnum } from "src/app/enum/role.enum";
import { DashboardExceptionFilter } from "src/app/exception/filter/dashboard-exception-filter";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";
import { Roles } from "src/auth/roles/require-roles.decorator";
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

  @Get('create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
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
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
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
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async getLocationsPage(@Request() req, @Res() res: Response): Promise<void> {    
    const locations: LocationEntity[] = await this.service.findLocations();

    return DashboardResponseRender.renderForAuthenticatedUser(
      res,
      'location/locations',
      req.user,
      'location',
      {
        locations: locations,
        showContent: locations.length > 0,
      },
    );
  }

  @Post('create')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
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
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/location');
  }

  @Post('update')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
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
          ...DashboardErrorMapper.map(errors)
        }
      );
    }  

    return res.redirect('/dashboard/location');
  }

  @Get('delete/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(AuthenticatedGuard)
  public async deleteLocation(@Param('id', ParseIntPipe) locationId: number, @Request() req, @Res() res: Response): Promise<void> {     
    await this.service.deleteLocation(locationId);

    return res.redirect('/dashboard/location');
  }

}