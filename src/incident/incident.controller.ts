import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { IncidentTypeNotFoundExample } from 'src/app/docs/example/incident/incident-type-not-found-example';
import { RoleEnum } from 'src/app/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles/require-roles.decorator';
import { CreateIncidentRequestDTO } from './dto/request/create-incident-request.dto';
import { CreateIncidentTypeRequestDTO } from './dto/request/create-incident-type-request.dto';
import { UpdateIncidentTypeRequestDTO } from './dto/request/update-incident-type-request.dto';
import { DeleteIncidentTypeResponseDTO } from './dto/response/delete-incident-type-response.dto';
import { ListIncidentResponseDTO } from './dto/response/list-incident-response.dto';
import { ListIncidentTypeResponseDTO } from './dto/response/list-incident-type-response.dto';
import { ListIncidentTypesResponseDTO } from './dto/response/list-incident-types-response.dto';
import { IncidentTypeEntity } from './entity/incident-type.entity';
import { IncidentEntity } from './entity/incident.entity';
import { IncidentService } from './incident.service';

@Controller('incident')
@ApiTags('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os tipos de incidente' })
  @ApiOkResponse({ type: ListIncidentTypesResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidentTypes(): Promise<ListIncidentTypesResponseDTO> {
    const incidentTypes: IncidentTypeEntity[] = await this.incidentService.findIncidentTypes();
    
    return new ListIncidentTypesResponseDTO(incidentTypes);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar tipo de incidente pelo ID' })
  @ApiOkResponse({ type: ListIncidentTypeResponseDTO })
  @ApiNotFoundResponse({type: IncidentTypeNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidentTypeByID(@Param('id', ParseIntPipe) id: number): Promise<ListIncidentTypeResponseDTO> {
    const incidentType: IncidentTypeEntity = await this.incidentService.findIncidentTypeByIDOrCry(id);
    
    return new ListIncidentTypeResponseDTO(incidentType);
  }

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar novo incidente' })
  @ApiBody({ type: CreateIncidentRequestDTO })
  @ApiOkResponse({ type: ListIncidentResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async createIncident(@Body() createIncidentRequestDTO: CreateIncidentRequestDTO): Promise<ListIncidentResponseDTO> {
    const incident: IncidentEntity = await this.incidentService.createIncident(createIncidentRequestDTO);
    
    return new ListIncidentResponseDTO(incident);
  }

  @Post('type')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar novo tipo de incidente' })
  @ApiBody({ type: [CreateIncidentTypeRequestDTO] })
  @ApiOkResponse({ type: ListIncidentTypeResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async createIncidentType(@Body() createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO): Promise<ListIncidentTypeResponseDTO> {
    const incidentType: IncidentTypeEntity = await this.incidentService.createIncidentType(createIncidentTypeRequestDTO);
    
    return new ListIncidentTypeResponseDTO(incidentType);
  }

  @Put()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar tipo de incidente' })
  @ApiBody({ type: [UpdateIncidentTypeRequestDTO] })
  @ApiOkResponse({ type: ListIncidentTypeResponseDTO })
  @ApiNotFoundResponse({type: IncidentTypeNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async updateIncidentType(@Body() updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO): Promise<ListIncidentTypeResponseDTO> {
    const incidentType: IncidentTypeEntity = await this.incidentService.updateIncidentType(updateIncidentTypeRequestDTO);
    
    return new ListIncidentTypeResponseDTO(incidentType);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Excluir tipo de incidente' })
  @ApiOkResponse({ type: DeleteIncidentTypeResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async deleteIncidentType(@Param('id', ParseIntPipe) id: number): Promise<DeleteIncidentTypeResponseDTO> {
    await this.incidentService.deleteIncidentType(id);
    
    return new DeleteIncidentTypeResponseDTO('DELETED');
  }
  
}
