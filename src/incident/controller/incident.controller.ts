import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { IncidentNotFoundExample } from 'src/app/docs/example/incident/incident-not-found-example';
import { RoleEnum } from 'src/app/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles/require-roles.decorator';
import { SearchIncidentsRequestDTO } from 'src/dashboard/dto/request/search-incidents-request.dto';
import { CreateIncidentRequestDTO } from '../dto/request/create-incident-request.dto';
import { ListIncidentResponseDTO } from '../dto/response/list-incident-response.dto';
import { ListIncidentsResponseDTO } from '../dto/response/list-incidents-response.dto';
import { IncidentEntity } from '../entity/incident.entity';
import { IncidentService } from '../service/incident.service';

@ApiBearerAuth()
@ApiHeader({name: 'Authorization'})
@Controller('incident')
@ApiTags('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get('user/:status')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar incidentes do usuário filtrados por status'})
  @ApiOkResponse({ type: ListIncidentsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listUserIncidentsByStatus(@Param('status') status: string, @Request() req): Promise<ListIncidentsResponseDTO> {
    console.log('listUserIncidentsByStatus');
    console.log(status);
    console.log(req.user.id);
    const incidents: IncidentEntity[] = await this.incidentService.findIncidentsByStatus(req.user, SearchIncidentsRequestDTO.fromStatus(status));
    console.log(incidents)
    return new ListIncidentsResponseDTO(incidents);
  }

  @Get(':status')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar incidentes filtrados por status'})
  @ApiOkResponse({ type: ListIncidentsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidentsByStatus(@Param('status') status: string): Promise<ListIncidentsResponseDTO> {
    console.log('listIncidentsByStatus');
    console.log(status);
    console.log(null);
    const incidents: IncidentEntity[] = await this.incidentService.findIncidentsByStatus(null, SearchIncidentsRequestDTO.fromStatus(status));
    console.log(incidents)
    return new ListIncidentsResponseDTO(incidents);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os incidentes'})
  @ApiOkResponse({ type: ListIncidentsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidents(): Promise<ListIncidentsResponseDTO> {
    const incidents: IncidentEntity[] = await this.incidentService.findIncidents();
    
    return new ListIncidentsResponseDTO(incidents);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar incidente pelo ID' })
  @ApiOkResponse({ type: ListIncidentResponseDTO })
  @ApiNotFoundResponse({type: IncidentNotFoundExample})
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidentByID(@Param('id', ParseIntPipe) id: number): Promise<ListIncidentResponseDTO> {
    const incident: IncidentEntity = await this.incidentService.findIncidentByIDOrCry(id);
    
    return new ListIncidentResponseDTO(incident);
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
  
}
