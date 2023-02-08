import { HttpStatus, Injectable } from '@nestjs/common';
import { incident, incident_interaction, incident_type } from '@prisma/client';
import { RoleEnum } from 'src/app/enum/role.enum';
import { IncidentStatusEnum } from 'src/app/enum/status.enum';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { CreateItemRequestDTO } from 'src/item/dto/request/create-item-request.dto';
import { ItemEntity } from 'src/item/entity/item.entity';
import { ItemService } from 'src/item/item.service';
import { CreateLocationRequestDTO } from 'src/location/dto/request/create-location-request.dto';
import { LocationEntity } from 'src/location/entity/location.entity';
import { LocationService } from 'src/location/location.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreateIncidentInteractionRequestDTO } from './dto/request/create-incident-interaction-request.dto';
import { CreateIncidentRequestDTO } from './dto/request/create-incident-request.dto';
import { CreateIncidentTypeRequestDTO } from './dto/request/create-incident-type-request.dto';
import { UpdateIncidentTypeRequestDTO } from './dto/request/update-incident-type-request.dto';
import { IncidentInteractionEntity } from './entity/incident-interaction.entity';
import { IncidentTypeEntity } from './entity/incident-type.entity';
import { IncidentEntity } from './entity/incident.entity';
import { IncidentRepository } from './incident.repository';

@Injectable()
export class IncidentService {

  private repository: IncidentRepository;

  constructor(
    private databaseService: DatabaseService,
    private locationService: LocationService,
    private itemService: ItemService,
  ) {
    this.repository = new IncidentRepository(this.databaseService);
  }

  public async findIncidents(): Promise<IncidentEntity[]> {
    const incidentDb: incident[] = await this.repository.findIncidents();

    return incidentDb.map((incident: incident) => {
      return IncidentEntity.fromRepository(incident);
    });
  }

  public async findUserIncidents(user: UserEntity): Promise<IncidentEntity[]> {
    const incidentDb: incident[] = await this.repository.findUserIncidents(user);

    return incidentDb.map((incident: incident) => {
      return IncidentEntity.fromRepository(incident);
    });
  }

  public async findIncidentTypes(): Promise<IncidentTypeEntity[]> {
    const incidentTypesDb: incident_type[] = await this.repository.findIncidentTypes();

    return incidentTypesDb.map((incidentType: incident_type) => {
      return IncidentTypeEntity.fromRepository(incidentType);
    });
  }

  public async findIncidentByIDOrCry(id: number): Promise<IncidentEntity> {
    const incidentDb: incident | null = await this.repository.findIncidentByID(id);

    if (!incidentDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'Incident with ID ' + id + ' not found on database.', 
        HttpOperationErrorCodes.INCIDENT_NOT_FOUND,
      );
    }

    return IncidentEntity.fromRepository(incidentDb);
  }

  public async findIncidentTypeByIDOrCry(id: number): Promise<IncidentTypeEntity> {
    const incidentTypeDb: incident_type | null = await this.repository.findIncidentTypeByID(id);

    if (!incidentTypeDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'Incident type with ID ' + id + ' not found on database.', 
        HttpOperationErrorCodes.INCIDENT_TYPE_NOT_FOUND,
      );
    }

    return IncidentTypeEntity.fromRepository(incidentTypeDb);
  }

  public async createIncident(createIncidentRequestDTO: CreateIncidentRequestDTO): Promise<IncidentEntity> {
    await this.findOrCreateIncidentType(createIncidentRequestDTO);
    await this.findOrCreateLocation(createIncidentRequestDTO);
    await this.findOrCreateItem(createIncidentRequestDTO);

    const incidentDb: incident = await this.repository.createIncident(createIncidentRequestDTO);

    return IncidentEntity.fromRepository(incidentDb);
  }

  public async createIncidentType(createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO): Promise<IncidentTypeEntity> {
    const incidentTypeDb: incident_type = await this.repository.createIncidentType(createIncidentTypeRequestDTO);

    return IncidentTypeEntity.fromRepository(incidentTypeDb);
  }

  public async updateIncidentType(updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO): Promise<IncidentTypeEntity> {
    await this.findIncidentTypeByIDOrCry(updateIncidentTypeRequestDTO.id);
    
    const incidentTypeDb: incident_type = await this.repository.updateIncidentType(updateIncidentTypeRequestDTO);

    return IncidentTypeEntity.fromRepository(incidentTypeDb);
  }

  public async deleteIncidentType(incidentTypeId: number): Promise<void> {
    const incidentType: IncidentTypeEntity = await this.findIncidentTypeByIDOrCry(incidentTypeId);

    await this.repository.deleteIncidentType(incidentType);
  }

  public async createIncidentInteraction(user: UserEntity, createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO): Promise<IncidentInteractionEntity> {
    const incidentDb: IncidentEntity = await this.findIncidentByIDOrCry(createIncidentInteractionRequestDTO.incidentId);
    const incidentInteractionDb: incident_interaction = await this.repository.createIncidentInteraction(createIncidentInteractionRequestDTO);

    if ( incidentDb.status === IncidentStatusEnum.OPEN && user.role === RoleEnum.ADMIN) {
      await this.repository.assignIncidentToAdmin(user, incidentDb);
    }

    return IncidentInteractionEntity.fromRepository(incidentInteractionDb);
  }

  public async findIncidentInteractions(incidentId: number): Promise<IncidentInteractionEntity[]> {
    const incidentInteractionsDb: incident_interaction[] = await this.repository.findIncidentInteractions(incidentId);

    return incidentInteractionsDb.map((incidentInteraction: incident_interaction) => {
      return IncidentInteractionEntity.fromRepository(incidentInteraction);
    });
  }

  private async findOrCreateIncidentType(createIncidentRequestDTO: CreateIncidentRequestDTO): Promise<void> {
    if (createIncidentRequestDTO.incidentTypeId > 0) {
      const incidentType: IncidentTypeEntity = await this.findIncidentTypeByIDOrCry(createIncidentRequestDTO.incidentTypeId);
      createIncidentRequestDTO.incidentTypeId = incidentType.id;
      return;
    }

    const createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO = new CreateIncidentTypeRequestDTO();
    createIncidentTypeRequestDTO.name = createIncidentRequestDTO.incidentTypeName;
    createIncidentTypeRequestDTO.description = createIncidentRequestDTO.incidentTypeDescription;

    const incidentType: IncidentTypeEntity = await this.createIncidentType(createIncidentTypeRequestDTO);
    createIncidentRequestDTO.incidentTypeId = incidentType.id;
  }

  private async findOrCreateLocation(createIncidentRequestDTO: CreateIncidentRequestDTO): Promise<void> {
    if (createIncidentRequestDTO.locationId > 0) {
      const location: LocationEntity = await this.locationService.findLocationByIDOrCry(createIncidentRequestDTO.locationId);
      createIncidentRequestDTO.locationId = location.id;
      return;
    }

    const createLocationRequestDTO: CreateLocationRequestDTO = new CreateLocationRequestDTO();
    createLocationRequestDTO.name = createIncidentRequestDTO.locationName;
    createLocationRequestDTO.description = createIncidentRequestDTO.locationDescription;

    const location: LocationEntity = await this.locationService.createLocation(createLocationRequestDTO);
    createIncidentRequestDTO.locationId = location.id;
  }

  private async findOrCreateItem(createIncidentRequestDTO: CreateIncidentRequestDTO): Promise<ItemEntity> {
    if (createIncidentRequestDTO.itemId > 0) {
      const item: ItemEntity = await this.itemService.findItemByIDOrCry(createIncidentRequestDTO.itemId);
      createIncidentRequestDTO.itemId = item.id;
      return;
    }

    const createItemRequestDTO: CreateItemRequestDTO = new CreateItemRequestDTO();
    createItemRequestDTO.name = createIncidentRequestDTO.itemName;
    createItemRequestDTO.description = createIncidentRequestDTO.itemDescription;
    createItemRequestDTO.locationId = createIncidentRequestDTO.locationId;

    const item: ItemEntity = await this.itemService.createItem(createItemRequestDTO);
    createIncidentRequestDTO.itemId = item.id;
  }

  public async assignIncidentToAdmin(userAdmin: UserEntity, incidentId: number): Promise<IncidentEntity> {
    const incidentDb: IncidentEntity = await this.findIncidentByIDOrCry(incidentId);
    const assignedIncident: incident = await this.repository.assignIncidentToAdmin(userAdmin, incidentDb);

    return IncidentEntity.fromRepository(assignedIncident);
  }

  public async closeIncident(user: UserEntity, incidentId: number): Promise<IncidentEntity> {
    const incidentDb: IncidentEntity = await this.findIncidentByIDOrCry(incidentId);
    
    if (incidentDb.adminId === user.id || incidentDb.userId === user.id) {
      const closedIncident: incident = await this.repository.setIncidentToClosed(incidentDb);

      return IncidentEntity.fromRepository(closedIncident);
    }

    console.log(incidentDb);
    console.log(user);

    throw new HttpOperationException(
      HttpStatus.FORBIDDEN, 
      'Only the creator user or assigned admin can close the incident.', 
      HttpOperationErrorCodes.INVALID_ASSIGNED_ADMIN_CLOSE_INCIDENT,
    );
  }

}
