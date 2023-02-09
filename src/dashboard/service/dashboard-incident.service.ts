import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateIncidentInteractionRequestDTO } from 'src/incident/dto/request/create-incident-interaction-request.dto';
import { CreateIncidentRequestDTO } from 'src/incident/dto/request/create-incident-request.dto';
import { IncidentInteractionEntity } from 'src/incident/entity/incident-interaction.entity';
import { IncidentTypeEntity } from 'src/incident/entity/incident-type.entity';
import { IncidentEntity } from 'src/incident/entity/incident.entity';
import { IncidentService } from 'src/incident/incident.service';
import { ItemEntity } from 'src/item/entity/item.entity';
import { ItemService } from 'src/item/item.service';
import { LocationEntity } from 'src/location/entity/location.entity';
import { LocationService } from 'src/location/location.service';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class DashboardIncidentService {

  constructor(
    private readonly incidentService: IncidentService,
    private readonly locationService: LocationService,
    private readonly itemService: ItemService,
  ) {}

  public async findIncidents(): Promise<IncidentEntity[]> {
    return await this.incidentService.findIncidents();
  }

  public async findUserIncidentsByStatus(user: UserEntity, status: string): Promise<IncidentEntity[]> {
    return await this.incidentService.findUserIncidentsByStatus(user, status);
  }

  public async findIncidentTypes(): Promise<IncidentTypeEntity[]> {
    return await this.incidentService.findIncidentTypes();
  }

  public async findIncidentInteractions(interactionId: number): Promise<IncidentInteractionEntity[]> {
    return await this.incidentService.findIncidentInteractions(interactionId);
  }

  public async findLocations(): Promise<LocationEntity[]> {
    return await this.locationService.findLocations();
  }

  public async findItemsByLocationID(locationId: number): Promise<ItemEntity[]> {
    return await this.itemService.findItemsByLocationID(locationId);
  }

  public async findIncidentByIDOrCry(id: number): Promise<IncidentEntity> {
    return await this.incidentService.findIncidentByIDOrCry(id);
  }

  public async createIncident(createIncidentRequestDTO: CreateIncidentRequestDTO): Promise<void> {
    await validateOrReject(createIncidentRequestDTO);

    await this.incidentService.createIncident(createIncidentRequestDTO); 
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

}
