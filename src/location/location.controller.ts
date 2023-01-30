import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { LocationNotFoundExample } from 'src/app/docs/example/location/location-not-found-example';
import { PermissionEnum } from 'src/app/enum/permission.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import PermissionGuard from 'src/auth/guard/permission.guard';
import { CreateLocationRequestDTO } from './dto/request/create-location-request.dto';
import { ListLocationResponseDTO } from './dto/response/list-location-response.dto';
import { ListLocationsResponseDTO } from './dto/response/list-locations-response.dto';
import { LocationEntity } from './entity/location.entity';
import { LocationService } from './location.service';

@ApiBearerAuth()
@ApiHeader({name: 'Authorization'})
@Controller('location')
@ApiTags('location')
export class LocationController {

  constructor(private readonly locationService: LocationService) {}

  @Get()
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.LIST_LOCATIONS)
  )
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listLocations(): Promise<ListLocationsResponseDTO> {
    const locations: LocationEntity[] = await this.locationService.findLocations();
    
    return new ListLocationsResponseDTO(locations);
  }

  @Get(':id')
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.LIST_LOCATION)
  )
  @ApiNotFoundResponse({type: LocationNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listLocationByID(@Param('id', ParseIntPipe) id: number): Promise<ListLocationResponseDTO> {
    const location: LocationEntity = await this.locationService.findLocationByIDOrCry(id);
    
    return new ListLocationResponseDTO(location);
  }

  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.CREATE_LOCATION)
  )
  
  @ApiBody({ type: [CreateLocationRequestDTO] })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async createLocation(@Body() createLocationRequestDTO: CreateLocationRequestDTO): Promise<ListLocationResponseDTO> {
    const location: LocationEntity = await this.locationService.createLocation(createLocationRequestDTO);
    
    return new ListLocationResponseDTO(location);
  }
  
}
