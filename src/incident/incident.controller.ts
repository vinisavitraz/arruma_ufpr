import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { IncidentTypeNotFoundExample } from 'src/app/docs/example/incident/incident-type-not-found-example';
import { LocationNotFoundExample } from 'src/app/docs/example/location/location-not-found-example';
import { PermissionEnum } from 'src/app/enum/permission.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import PermissionGuard from 'src/auth/guard/permission.guard';
import { CreateLocationRequestDTO } from 'src/location/dto/request/create-location-request.dto';
import { UpdateLocationRequestDTO } from 'src/location/dto/request/update-location-request.dto';
import { DeleteLocationResponseDTO } from 'src/location/dto/response/delete-location-response.dto';
import { ListLocationResponseDTO } from 'src/location/dto/response/list-location-response.dto';
import { LocationEntity } from 'src/location/entity/location.entity';
import { CreateIncidentTypeRequestDTO } from './dto/request/create-incident-type-request.dto';
import { UpdateIncidentTypeRequestDTO } from './dto/request/update-incident-type-request.dto';
import { DeleteIncidentTypeResponseDTO } from './dto/response/delete-incident-type-response.dto';
import { ListIncidentTypeResponseDTO } from './dto/response/list-incident-type-response.dto';
import { ListIncidentTypesResponseDTO } from './dto/response/list-incident-types-response.dto';
import { IncidentTypeEntity } from './entity/incident-type.entity';
import { IncidentService } from './incident.service';

@Controller('incident')
@ApiTags('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.INCIDENT_TYPES_PAGE)
  )
  @ApiOperation({ summary: 'Listar todos os tipos de incidente' })
  @ApiOkResponse({ type: ListIncidentTypesResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidentTypes(): Promise<ListIncidentTypesResponseDTO> {
    const incidentTypes: IncidentTypeEntity[] = await this.incidentService.findIncidentTypes();
    
    return new ListIncidentTypesResponseDTO(incidentTypes);
  }

  @Get(':id')
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.INCIDENT_TYPES_PAGE)
  )
  @ApiOperation({ summary: 'Listar tipo de incidente pelo ID' })
  @ApiOkResponse({ type: ListIncidentTypeResponseDTO })
  @ApiNotFoundResponse({type: IncidentTypeNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidentTypeByID(@Param('id', ParseIntPipe) id: number): Promise<ListIncidentTypeResponseDTO> {
    const incidentType: IncidentTypeEntity = await this.incidentService.findIncidentTypeByIDOrCry(id);
    
    return new ListIncidentTypeResponseDTO(incidentType);
  }

  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.CREATE_INCIDENT_TYPE_PAGE)
  )
  @ApiOperation({ summary: 'Criar novo tipo de incidente' })
  @ApiBody({ type: [CreateIncidentTypeRequestDTO] })
  @ApiOkResponse({ type: ListIncidentTypeResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async createLocation(@Body() createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO): Promise<ListIncidentTypeResponseDTO> {
    const incidentType: IncidentTypeEntity = await this.incidentService.createIncidentType(createIncidentTypeRequestDTO);
    
    return new ListIncidentTypeResponseDTO(incidentType);
  }

  @Put()
  @UseGuards(
    JwtAuthGuard,
    PermissionGuard(PermissionEnum.UPDATE_INCIDENT_TYPE_PAGE)
  )
  @ApiOperation({ summary: 'Atualizar tipo de incidente' })
  @ApiBody({ type: [UpdateIncidentTypeRequestDTO] })
  @ApiOkResponse({ type: ListIncidentTypeResponseDTO })
  @ApiNotFoundResponse({type: IncidentTypeNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async updateLocation(@Body() updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO): Promise<ListIncidentTypeResponseDTO> {
    const incidentType: IncidentTypeEntity = await this.incidentService.updateIncidentType(updateIncidentTypeRequestDTO);
    
    return new ListIncidentTypeResponseDTO(incidentType);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tipo de incidente' })
  @ApiOkResponse({ type: DeleteIncidentTypeResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async deleteLocation(@Param('id', ParseIntPipe) id: number): Promise<DeleteIncidentTypeResponseDTO> {
    await this.incidentService.deleteIncidentType(id);
    
    return new DeleteIncidentTypeResponseDTO('DELETED');
  }
  
}
