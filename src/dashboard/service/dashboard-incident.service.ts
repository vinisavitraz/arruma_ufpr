import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateIncidentRequestDTO } from 'src/incident/dto/request/create-incident-request.dto';
import { IncidentTypeEntity } from 'src/incident/entity/incident-type.entity';
import { IncidentEntity } from 'src/incident/entity/incident.entity';
import { IncidentService } from 'src/incident/incident.service';
import { ItemEntity } from 'src/item/entity/item.entity';
import { ItemService } from 'src/item/item.service';
import { LocationEntity } from 'src/location/entity/location.entity';
import { LocationService } from 'src/location/location.service';

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

  public async findIncidentTypes(): Promise<IncidentTypeEntity[]> {
    return await this.incidentService.findIncidentTypes();
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

}
