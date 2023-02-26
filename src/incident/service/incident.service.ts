import { HttpStatus, Injectable } from '@nestjs/common';
import { incident, incident_interaction, incident_type, item, location, user } from '@prisma/client';
import { validateOrReject } from 'class-validator';
import { RoleEnum } from 'src/app/enum/role.enum';
import { IncidentStatusEnum } from 'src/app/enum/status.enum';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { SearchIncidentTypesRequestDTO } from 'src/dashboard/dto/request/search-incident-types-request.dto';
import { SearchIncidentsRequestDTO } from 'src/dashboard/dto/request/search-incidents-request.dto';
import { DatabaseService } from 'src/database/database.service';
import { FileMetadataEntity } from 'src/file/entity/file-metadata.entity';
import { FileService } from 'src/file/file.service';
import { CreateItemRequestDTO } from 'src/item/dto/request/create-item-request.dto';
import { ItemEntity } from 'src/item/entity/item.entity';
import { ItemService } from 'src/item/item.service';
import { CreateLocationRequestDTO } from 'src/location/dto/request/create-location-request.dto';
import { LocationEntity } from 'src/location/entity/location.entity';
import { LocationService } from 'src/location/location.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreateIncidentInteractionRequestDTO } from '../dto/request/create-incident-interaction-request.dto';
import { CreateIncidentRequestDTO } from '../dto/request/create-incident-request.dto';
import { CreateIncidentTypeRequestDTO } from '../dto/request/create-incident-type-request.dto';
import { UpdateIncidentRequestDTO } from '../dto/request/update-incident-request.dto';
import { IncidentInteractionEntity } from '../entity/incident-interaction.entity';
import { IncidentTypeEntity } from '../entity/incident-type.entity';
import { IncidentEntity } from '../entity/incident.entity';
import { IncidentRepository } from '../incident.repository';
import { IncidentTypeService } from './incident-type.service';

@Injectable()
export class IncidentService {

  private repository: IncidentRepository;

  constructor(
    private databaseService: DatabaseService,
    private locationService: LocationService,
    private itemService: ItemService,
    private incidentTypeService: IncidentTypeService,
    private fileService: FileService,
  ) {
    this.repository = new IncidentRepository(this.databaseService);
  }

  public async findIncidentsByStatus(user: UserEntity | null, searchIncidentsRequestDTO: SearchIncidentsRequestDTO): Promise<IncidentEntity[]> {    
    const incidentsDb: (
      incident & {
        interactions: incident_interaction[], 
        admin: user | null, 
        user: user, 
        incident_type: incident_type, 
        location: location, 
        item: item,
      }
    )[] = await this.repository.searchIncidents(
      searchIncidentsRequestDTO, 
      user,
    );

    return incidentsDb.map((
      incident: incident & {
        interactions: incident_interaction[], 
        admin: user | null, 
        user: user, 
        incident_type: incident_type, 
        location: location, 
        item: item,
      }
    ) => {
      return IncidentEntity.fromRepository(incident);
    });
  }

  public async searchIncidentTypes(searchIncidentTypesRequestDTO: SearchIncidentTypesRequestDTO): Promise<IncidentTypeEntity[]> {    
    const incidentTypesDb: incident_type[] = await this.repository.searchIncidentTypes(
      searchIncidentTypesRequestDTO
    );

    return incidentTypesDb.map((incidentType: incident_type) => {
      return IncidentTypeEntity.fromRepository(incidentType);
    });
  }

  public async findIncidents(): Promise<IncidentEntity[]> {
    const incidentsDb: (
      incident & {
        interactions: incident_interaction[], 
        admin: user | null, 
        user: user, 
        incident_type: incident_type, 
        location: location, 
        item: item,
      }
    )[] = await this.repository.findIncidents();

    return incidentsDb.map((
      incident: incident & {
        interactions: incident_interaction[], 
        admin: user | null, 
        user: user, 
        incident_type: incident_type, 
        location: location, 
        item: item,
      }
    ) => {
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
    const incidentDb: incident & {
      interactions: incident_interaction[], 
      admin: user | null, 
      user: user, 
      incident_type: incident_type, 
      location: location, 
      item: item,
    } | null = await this.repository.findIncidentByID(id);

    if (!incidentDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'Incident with ID ' + id + ' not found on database.', 
        HttpOperationErrorCodes.INCIDENT_NOT_FOUND,
      );
    }

    return IncidentEntity.fromRepository(incidentDb);
  }

  public async findIncidentByIDAndStatus(id: number, status: string | undefined): Promise<IncidentEntity> {
    const incidentDb: incident & {
      interactions: incident_interaction[], 
      admin: user | null, 
      user: user, 
      incident_type: incident_type, 
      location: location,
      item: item,
    } | null = await this.repository.findIncidentByIDAndStatus(id, status);

    if (!incidentDb) {
      return null;
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

  public async createIncident(createIncidentRequestDTO: CreateIncidentRequestDTO, image: Express.Multer.File | undefined): Promise<IncidentEntity> {
    await this.findOrCreateIncidentType(createIncidentRequestDTO);
    await this.findOrCreateLocation(createIncidentRequestDTO);
    await this.findOrCreateItem(createIncidentRequestDTO);

    let fileMetadataId: number | null = null;

    if (image !== undefined) {
      const fileMetadata: FileMetadataEntity = await this.fileService.saveNewFileMetadataFromDashboard(image);
      fileMetadataId = fileMetadata.id;
    }
    
    const incidentDb: incident & {
      interactions: incident_interaction[], 
      admin: user | null, 
      user: user,
      incident_type: incident_type, 
      location: location,
      item: item,
    } = await this.repository.createIncident(createIncidentRequestDTO, fileMetadataId);

    return IncidentEntity.fromRepository(incidentDb);
  }

  public async updateIncident(updateIncidentRequestDTO: UpdateIncidentRequestDTO, image: Express.Multer.File | undefined): Promise<IncidentEntity> {
    const incident: IncidentEntity = await this.findIncidentByIDOrCry(updateIncidentRequestDTO.id);
    const incidentType: IncidentTypeEntity = await this.findIncidentTypeByIDOrCry(updateIncidentRequestDTO.incidentTypeId);
    const location: LocationEntity = await this.locationService.findLocationByIDOrCry(updateIncidentRequestDTO.locationId);
    const item: ItemEntity = await this.itemService.findItemByIDOrCry(updateIncidentRequestDTO.itemId);
    let fileMetadata: FileMetadataEntity | null = null;

    if (incident.fileMetadataId !== null) {
      fileMetadata = await this.fileService.getFileMetadataByID(incident.fileMetadataId);
    }

    if (image !== undefined && fileMetadata != null) {
      await this.fileService.deleteFileMetadataByID(fileMetadata.id);
      fileMetadata = await this.fileService.saveNewFileMetadataFromDashboard(image);
    }

    let fileMetadataId: number | null = null;

    if (fileMetadata !== null) {
      fileMetadataId = fileMetadata.id;
    }
    
    const incidentDb: incident & {
      interactions: incident_interaction[], 
      admin: user | null, 
      user: user,
      incident_type: incident_type, 
      location: location,
      item: item,
    } = await this.repository.updateIncident(updateIncidentRequestDTO, fileMetadataId);

    return IncidentEntity.fromRepository(incidentDb);
  }

  public async createIncidentInteraction(user: UserEntity, createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO): Promise<IncidentInteractionEntity> {
    const incidentDb: IncidentEntity = await this.findIncidentByIDOrCry(createIncidentInteractionRequestDTO.incidentId);

    if ( incidentDb.status === IncidentStatusEnum.OPEN && user.role === RoleEnum.ADMIN) {
      await this.repository.assignIncidentToAdmin(user, incidentDb);
    }
    const incidentInteractionDb: incident_interaction & {user: user} | null = await this.repository.createIncidentInteraction(createIncidentInteractionRequestDTO);

    return IncidentInteractionEntity.fromRepository(incidentInteractionDb);
  }

  public async findIncidentInteractions(incidentId: number): Promise<IncidentInteractionEntity[]> {
    const incidentInteractionsDb: (incident_interaction & { user: user })[] = await this.repository.findIncidentInteractions(incidentId);

    return incidentInteractionsDb.map((incidentInteraction: incident_interaction & { user: user }) => {
      return IncidentInteractionEntity.fromRepository(incidentInteraction);
    });
  }

  public async findIncidentInteractionsWithUsers(incidentId: number): Promise<IncidentInteractionEntity[]> {
    const incidentInteractionsDb: (incident_interaction & { user: user })[] = await this.repository.findIncidentInteractions(incidentId);

    return incidentInteractionsDb.map((incidentInteraction: incident_interaction & { user: user }) => {
      return IncidentInteractionEntity.fromRepository(incidentInteraction);
    });
  }

  public async findTotalIncidentsByStatusAndUser(incidentStatus: string, userId: number): Promise<number> {
    const status: string | undefined = incidentStatus !== '' ? incidentStatus : undefined;
    const id: number | undefined = userId > 0 ? userId : undefined;

    return await this.repository.findTotalIncidentsByStatusForHomePage(status, id);
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

    await validateOrReject(createIncidentTypeRequestDTO);

    const incidentType: IncidentTypeEntity = await this.incidentTypeService.createIncidentType(createIncidentTypeRequestDTO);
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

    await validateOrReject(createLocationRequestDTO);

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

    await validateOrReject(createItemRequestDTO);

    const item: ItemEntity = await this.itemService.createItem(createItemRequestDTO);
    createIncidentRequestDTO.itemId = item.id;
  }

  public async assignIncidentToAdmin(userAdmin: UserEntity, incidentId: number): Promise<IncidentEntity> {
    if (userAdmin.role !== RoleEnum.ADMIN) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Assign user is not admin', 
        HttpOperationErrorCodes.INVALID_ASSIGNED_USER_ROLE_INCIDENT,
      );
    }

    const incidentDb: IncidentEntity = await this.findIncidentByIDOrCry(incidentId);
    const assignedIncident: incident & {
      interactions: incident_interaction[], 
      admin: user | null, 
      user: user,
      incident_type: incident_type, 
      location: location,
      item: item,
    } = await this.repository.assignIncidentToAdmin(userAdmin, incidentDb);

    await this.createNewInteractionBySystem(incidentDb, 'Incidente em atendimento - O administrador ' + userAdmin.name + ' está responsável por esse incidente.');
    
    return IncidentEntity.fromRepository(assignedIncident);
  }

  public async closeIncident(user: UserEntity, incidentId: number): Promise<IncidentEntity> {
    const incidentDb: IncidentEntity = await this.findIncidentByIDOrCry(incidentId);
    
    if (user.role === RoleEnum.ADMIN || (incidentDb.userId === user.id)) {
      const closedIncident: incident & {
        interactions: incident_interaction[], 
        admin: user | null, 
        user: user,
        incident_type: incident_type, 
        location: location,
        item: item,
      } = await this.repository.setIncidentStatus(
        incidentDb,
        IncidentStatusEnum.CLOSED,
        new Date(),
        incidentDb.rating,
      );

      await this.createNewInteractionBySystem(incidentDb, 'Incidente fechado - O administrador ' + user.name + ' fechou este incidente.');

      return IncidentEntity.fromRepository(closedIncident);
    }

    throw new HttpOperationException(
      HttpStatus.FORBIDDEN, 
      'Only the user creator or an admin can close the incident.', 
      HttpOperationErrorCodes.INVALID_ASSIGNED_ADMIN_CLOSE_INCIDENT,
    );
  }

  public async reopenIncident(user: UserEntity, incidentId: number): Promise<IncidentEntity> {
    const incidentDb: IncidentEntity = await this.findIncidentByIDOrCry(incidentId);
    
    if (user.role !== RoleEnum.ADMIN) {
      throw new HttpOperationException(
        HttpStatus.FORBIDDEN, 
        'Only the admin can reopen the incident.', 
        HttpOperationErrorCodes.INVALID_REOPEN_INCIDENT,
      );
    }
    if (user.role === RoleEnum.ADMIN || (incidentDb.userId === user.id)) {
      const reopenedIncident: incident & {
        interactions: incident_interaction[], 
        admin: user | null, 
        user: user,
        incident_type: incident_type, 
        location: location,
        item: item,
      } = await this.repository.setIncidentStatus(
        incidentDb,
        IncidentStatusEnum.PENDING,
        null,
        0,
      );

      await this.createNewInteractionBySystem(incidentDb, 'Incidente em atendimento - O administrador ' + user.name + ' reabriu este incidente.');

      return IncidentEntity.fromRepository(reopenedIncident);
    }

    throw new HttpOperationException(
      HttpStatus.FORBIDDEN, 
      'Only the user creator or an admin can close the incident.', 
      HttpOperationErrorCodes.INVALID_ASSIGNED_ADMIN_CLOSE_INCIDENT,
    );
  }

  public async setIncidentRating(user: UserEntity, incidentId: number, rating: number): Promise<IncidentEntity> {
    if (rating < 0 || rating > 3) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Invalid incident rating: ' + rating, 
        HttpOperationErrorCodes.INVALID_INCIDENT_RATING,
      );
    }
    const incidentDb: IncidentEntity = await this.findIncidentByIDOrCry(incidentId);
    const assignedIncident: incident & {
      interactions: incident_interaction[], 
      admin: user | null, 
      user: user,
      incident_type: incident_type, 
      location: location,
      item: item,
    } = await this.repository.setIncidentRating(incidentDb, rating);

    const suffix: string = rating > 1 ? 'estrelas' : 'estrela';
    await this.createNewInteractionBySystem(incidentDb, 'Atendimento avaliado - O usuário ' + user.name + ' avaliou o atendimento com ' + rating + ' ' + suffix);
    
    return IncidentEntity.fromRepository(assignedIncident);
  }

  public async searchIncidents(user: UserEntity | null, searchIncidentsRequestDTO: SearchIncidentsRequestDTO): Promise<IncidentEntity[]> {
    const incidents: IncidentEntity[] = [];

    if (searchIncidentsRequestDTO.incidentId && searchIncidentsRequestDTO.incidentId > 0) {
      const incident: IncidentEntity | null = await this.findIncidentByIDAndStatus(
        searchIncidentsRequestDTO.incidentId, 
        searchIncidentsRequestDTO.incidentStatus !== '' ? searchIncidentsRequestDTO.incidentStatus : undefined, 
      );

      if (incident) {
        incidents.push(incident);
      }
      
      return incidents;
    }
    const incidentsDb: (
      incident & {
        interactions: incident_interaction[], 
        admin: user | null, 
        user: user, 
        incident_type: incident_type, 
        location: location, 
        item: item,
      }
    )[] = await this.repository.searchIncidents(
      searchIncidentsRequestDTO,
      user,
    );

    return incidentsDb.map((
      incident: incident & {
        interactions: incident_interaction[], 
        admin: user | null, 
        user: user,
        incident_type: incident_type, 
        location: location, 
        item: item,
      }
    ) => {
      return IncidentEntity.fromRepository(incident);
    });
  }

  public async createNewInteractionBySystem(incident: IncidentEntity, description: string): Promise<IncidentInteractionEntity> {
    const incidentInteraction: CreateIncidentInteractionRequestDTO = new CreateIncidentInteractionRequestDTO();
    incidentInteraction.incidentId = incident.id;
    incidentInteraction.userId = null;
    incidentInteraction.origin = RoleEnum.SYSTEM;
    incidentInteraction.description = description;

    const incidentInteractionDb: incident_interaction & {user: user} | null = await this.repository.createIncidentInteraction(incidentInteraction);

    return IncidentInteractionEntity.fromRepository(incidentInteractionDb);
  }

}
