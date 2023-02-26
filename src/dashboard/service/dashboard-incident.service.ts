import { HttpStatus, Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { RoleEnum } from 'src/app/enum/role.enum';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { CreateIncidentInteractionRequestDTO } from 'src/incident/dto/request/create-incident-interaction-request.dto';
import { CreateIncidentRequestDTO } from 'src/incident/dto/request/create-incident-request.dto';
import { UpdateIncidentRequestDTO } from 'src/incident/dto/request/update-incident-request.dto';
import { IncidentInteractionEntity } from 'src/incident/entity/incident-interaction.entity';
import { IncidentTypeEntity } from 'src/incident/entity/incident-type.entity';
import { IncidentEntity } from 'src/incident/entity/incident.entity';
import { IncidentService } from 'src/incident/service/incident.service';
import { ItemEntity } from 'src/item/entity/item.entity';
import { ItemService } from 'src/item/item.service';
import { LocationEntity } from 'src/location/entity/location.entity';
import { LocationService } from 'src/location/location.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { IncidentsPageContent } from '../content/incidents-page.content';
import { SearchIncidentsRequestDTO } from '../dto/request/search-incidents-request.dto';

@Injectable()
export class DashboardIncidentService {

  constructor(
    private readonly incidentService: IncidentService,
    private readonly locationService: LocationService,
    private readonly itemService: ItemService,
  ) {}

  public async findTotalIncidentsByStatusAndUser(incidentStatus: string | undefined, userId: number | undefined): Promise<number> {
    return await this.incidentService.findTotalIncidentsByStatusAndUser(incidentStatus, userId);
  }

  public async findIncidentsByStatus(incidentPageContent: IncidentsPageContent): Promise<IncidentEntity[]> {
    return await this.incidentService.findIncidentsByStatus(null, SearchIncidentsRequestDTO.fromPageContent(incidentPageContent));
  }

  public async findUserIncidentsByStatus(
    user: UserEntity, 
    incidentPageContent: IncidentsPageContent,
  ): Promise<IncidentEntity[]> {
    return await this.incidentService.findIncidentsByStatus(user, SearchIncidentsRequestDTO.fromPageContent(incidentPageContent));
  }

  public async findIncidentTypes(): Promise<IncidentTypeEntity[]> {
    return await this.incidentService.findIncidentTypes();
  }

  public async findIncidentInteractions(user: UserEntity, interactionId: number): Promise<IncidentInteractionEntity[]> {
    return await this.incidentService.findIncidentInteractionsAndMarkAsRead(user, interactionId);
  }

  public async findLocations(): Promise<LocationEntity[]> {
    return await this.locationService.findLocations();
  }

  public async findItemsByLocationID(locationId: number): Promise<ItemEntity[]> {
    return await this.itemService.findItemsByLocationID(locationId);
  }

  public async findUserIncidentByIDOrCry(user: UserEntity, id: number): Promise<IncidentEntity> {
    const incident: IncidentEntity = await this.incidentService.findIncidentByIDOrCry(id);

    if (user.role === RoleEnum.USER && incident.userId !== user.id) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'Incident with ID ' + id + ' not visible for this user', 
        HttpOperationErrorCodes.INCIDENT_NOT_VISIBLE,
      );
    }
    
    return incident;
  }

  public async createIncident(createIncidentRequestDTO: CreateIncidentRequestDTO, image: Express.Multer.File | undefined): Promise<IncidentEntity> {
    await validateOrReject(createIncidentRequestDTO);

    return await this.incidentService.createIncident(createIncidentRequestDTO, image); 
  }

  public async updateIncident(updateIncidentRequestDTO: UpdateIncidentRequestDTO, image: Express.Multer.File | undefined): Promise<IncidentEntity> {
    await validateOrReject(updateIncidentRequestDTO);

    return await this.incidentService.updateIncident(updateIncidentRequestDTO, image); 
  }

  public async createIncidentInteraction(user: UserEntity, createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO): Promise<void> {
    await validateOrReject(createIncidentInteractionRequestDTO);

    await this.incidentService.createIncidentInteraction(user, createIncidentInteractionRequestDTO); 
  }

  public async assignIncidentToAdmin(userAdmin: UserEntity, incidentId: number): Promise<IncidentEntity> {
    return await this.incidentService.assignIncidentToAdmin(userAdmin, incidentId); 
  }

  public async closeIncident(user: UserEntity, incidentId: number): Promise<IncidentEntity> {
    return await this.incidentService.closeIncident(user, incidentId); 
  }

  public async reopenIncidente(user: UserEntity, incidentId: number): Promise<IncidentEntity> {
    return await this.incidentService.reopenIncident(user, incidentId); 
  }

  public async setIncidentRating(user: UserEntity, incidentId: number, rating: number): Promise<IncidentEntity> {
    return await this.incidentService.setIncidentRating(user, incidentId, rating); 
  }

}
