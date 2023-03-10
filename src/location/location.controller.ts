import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { LocationNotFoundExample } from 'src/app/docs/example/location/location-not-found-example';
import { RoleEnum } from 'src/app/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles/require-roles.decorator';
import { CreateLocationRequestDTO } from './dto/request/create-location-request.dto';
import { UpdateLocationRequestDTO } from './dto/request/update-location-request.dto';
import { DeleteLocationResponseDTO } from './dto/response/delete-location-response.dto';
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
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os locais' })
  @ApiOkResponse({ type: ListLocationsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listLocations(): Promise<ListLocationsResponseDTO> {
    const locations: LocationEntity[] = await this.locationService.findLocations();
    
    return new ListLocationsResponseDTO(locations);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar local pelo ID' })
  @ApiOkResponse({ type: ListLocationResponseDTO })
  @ApiNotFoundResponse({type: LocationNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listLocationByID(@Param('id', ParseIntPipe) id: number): Promise<ListLocationResponseDTO> {
    const location: LocationEntity = await this.locationService.findLocationByIDOrCry(id);
    
    return new ListLocationResponseDTO(location);
  }

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar novo local' })
  @ApiBody({ type: CreateLocationRequestDTO })
  @ApiOkResponse({ type: ListLocationResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async createLocation(@Body() createLocationRequestDTO: CreateLocationRequestDTO): Promise<ListLocationResponseDTO> {
    const location: LocationEntity = await this.locationService.createLocation(createLocationRequestDTO);
    
    return new ListLocationResponseDTO(location);
  }

  @Put()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar local' })
  @ApiBody({ type: UpdateLocationRequestDTO })
  @ApiOkResponse({ type: ListLocationResponseDTO })
  @ApiNotFoundResponse({type: LocationNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async updateLocation(@Body() updateLocationRequestDTO: UpdateLocationRequestDTO): Promise<ListLocationResponseDTO> {
    const location: LocationEntity = await this.locationService.updateLocation(updateLocationRequestDTO);
    
    return new ListLocationResponseDTO(location);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Excluir local' })
  @ApiOkResponse({ type: DeleteLocationResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async deleteLocation(@Param('id', ParseIntPipe) id: number): Promise<DeleteLocationResponseDTO> {
    await this.locationService.deleteLocation(id);
    
    return new DeleteLocationResponseDTO('DELETED');
  }
  
}
