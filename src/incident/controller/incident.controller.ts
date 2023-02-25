import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { IncidentNotFoundExample } from 'src/app/docs/example/incident/incident-not-found-example';
import { RoleEnum } from 'src/app/enum/role.enum';
import LocalFilesInterceptor from 'src/app/interceptor/local-files.interceptor';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles/require-roles.decorator';
import { SearchIncidentsRequestDTO } from 'src/dashboard/dto/request/search-incidents-request.dto';
import { CreateIncidentInteractionRequestDTO } from '../dto/request/create-incident-interaction-request.dto';
import { CreateIncidentRequestDTO } from '../dto/request/create-incident-request.dto';
import { AssignIncidentResponseDTO } from '../dto/response/assign-incident-response.dto';
import { CloseIncidentResponseDTO } from '../dto/response/close-incident-response.dto';
import { ListIncidentInteractionResponseDTO } from '../dto/response/list-incident-interaction-response.dto';
import { ListIncidentInteractionsResponseDTO } from '../dto/response/list-incident-interactions-response.dto';
import { ListIncidentResponseDTO } from '../dto/response/list-incident-response.dto';
import { ListIncidentsResponseDTO } from '../dto/response/list-incidents-response.dto';
import { IncidentInteractionEntity } from '../entity/incident-interaction.entity';
import { IncidentEntity } from '../entity/incident.entity';
import { IncidentService } from '../service/incident.service';

@ApiBearerAuth()
@ApiHeader({name: 'Authorization'})
@Controller('incident')
@ApiTags('incident')
export class IncidentController {

  constructor(private readonly incidentService: IncidentService) {}

  @Put('assign/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atribuir incidente para administrador'})
  @ApiOkResponse({ type: AssignIncidentResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async assignIncidentToAdmin(@Param('id', ParseIntPipe) incidentId: number, @Request() req): Promise<AssignIncidentResponseDTO> { 
    await this.incidentService.assignIncidentToAdmin(req.user, incidentId);
    
    return new AssignIncidentResponseDTO('atribuido');
  }

  @Put('close/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fechar incidente'})
  @ApiOkResponse({ type: CloseIncidentResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async closeIncident(@Param('id', ParseIntPipe) incidentId: number, @Request() req): Promise<CloseIncidentResponseDTO> { 
    await this.incidentService.closeIncident(req.user, incidentId);
    
    return new AssignIncidentResponseDTO('fechado');
  }

  @Get('interaction/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar interações do incidente'})
  @ApiOkResponse({ type: ListIncidentInteractionsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidentInteractions(@Param('id', ParseIntPipe) id: number): Promise<ListIncidentInteractionsResponseDTO> {
    const incidents: IncidentInteractionEntity[] = await this.incidentService.findIncidentInteractions(id);

    return new ListIncidentInteractionsResponseDTO(incidents);
  }

  @Get('status/:status')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar incidentes filtrados por status'})
  @ApiOkResponse({ type: ListIncidentsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listIncidentsByStatus(@Param('status') status: string): Promise<ListIncidentsResponseDTO> {
    const incidents: IncidentEntity[] = await this.incidentService.findIncidentsByStatus(null, SearchIncidentsRequestDTO.fromStatus(status));

    return new ListIncidentsResponseDTO(incidents);
  }

  @Get('user/status/:status')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar incidentes do usuário filtrados por status'})
  @ApiOkResponse({ type: ListIncidentsResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async listUserIncidentsByStatus(@Param('status') status: string, @Request() req): Promise<ListIncidentsResponseDTO> {
    const incidents: IncidentEntity[] = await this.incidentService.findIncidentsByStatus(req.user, SearchIncidentsRequestDTO.fromStatus(status));

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

  @Post('interaction')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar nova interação no incidente' })
  @ApiBody({ type: CreateIncidentInteractionRequestDTO })
  @ApiOkResponse({ type: ListIncidentInteractionResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async addInteractionToIncident(@Request() req, @Body() createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO): Promise<ListIncidentInteractionResponseDTO> { 
    const incidentInteraction: IncidentInteractionEntity = await this.incidentService.createIncidentInteraction(req.user, createIncidentInteractionRequestDTO);
    
    return new ListIncidentInteractionResponseDTO(incidentInteraction);
  }
  
  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar novo incidente' })
  @UseInterceptors(LocalFilesInterceptor({
    fieldName: 'image',
    path: '/incidents'
  }))
  @ApiBody({ type: CreateIncidentRequestDTO })
  @ApiOkResponse({ type: ListIncidentResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async createIncident(@Body() createIncidentRequestDTO: CreateIncidentRequestDTO, @UploadedFile() image: Express.Multer.File): Promise<ListIncidentResponseDTO> {
    const incident: IncidentEntity = await this.incidentService.createIncident(createIncidentRequestDTO, null);
    
    return new ListIncidentResponseDTO(incident);
  }
  
}
