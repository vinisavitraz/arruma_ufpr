import { incident, incident_interaction, incident_type, item, location, user } from "@prisma/client";
import { EntityStatusEnum, IncidentInteractionStatusEnum, IncidentStatusEnum } from "src/app/enum/status.enum";
import { SearchIncidentTypesRequestDTO } from "src/dashboard/dto/request/search-incident-types-request.dto";
import { SearchIncidentsRequestDTO } from "src/dashboard/dto/request/search-incidents-request.dto";
import { DatabaseService } from "src/database/database.service";
import { UserEntity } from "src/user/entity/user.entity";
import { CreateIncidentInteractionRequestDTO } from "./dto/request/create-incident-interaction-request.dto";
import { CreateIncidentRequestDTO } from "./dto/request/create-incident-request.dto";
import { CreateIncidentTypeRequestDTO } from "./dto/request/create-incident-type-request.dto";
import { UpdateIncidentRequestDTO } from "./dto/request/update-incident-request.dto";
import { UpdateIncidentTypeRequestDTO } from "./dto/request/update-incident-type-request.dto";
import { IncidentTypeEntity } from "./entity/incident-type.entity";
import { IncidentEntity } from "./entity/incident.entity";

export class IncidentRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async searchIncidents(
    searchIncidentsRequestDTO: SearchIncidentsRequestDTO,
    user: UserEntity | null,
  ): Promise<(incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item})[]> {
    return await this.connection.incident.findMany({
      skip: searchIncidentsRequestDTO.skip,
      take: searchIncidentsRequestDTO.maxPerPage,
      where: {
        id: searchIncidentsRequestDTO.incidentId,
        title: {
          contains: searchIncidentsRequestDTO.incidentTitle,
          mode: 'insensitive',
        },
        start_date: {
          gte: searchIncidentsRequestDTO.incidentOpenDate,
        },
        end_date: {
          lte: searchIncidentsRequestDTO.incidentEndDate,
        },
        user: {
          name: {
            contains: searchIncidentsRequestDTO.incidentUserName,
            mode: 'insensitive',
          },
          email: {
            contains: searchIncidentsRequestDTO.incidentUserEmail,
            mode: 'insensitive',
          },
        },
        status: searchIncidentsRequestDTO.incidentStatus,
        incident_type: {
          id: searchIncidentsRequestDTO.incidentTypeId,
        },
        location: {
          id: searchIncidentsRequestDTO.locationId,
        },
        item: {
          id: searchIncidentsRequestDTO.itemId,
        },
        AND: {
          OR: [
            {
              user_id: user === null ? undefined : user.id,
            },
            {
              admin_id: user === null ? undefined : user.id,
            },
          ],
        },
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          id: 'desc',
        },
      ],
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async searchIncidentTypes(searchIncidentTypesRequestDTO: SearchIncidentTypesRequestDTO): Promise<incident_type[]> {
    return await this.connection.incident_type.findMany({
      skip: searchIncidentTypesRequestDTO.skip,
      take: searchIncidentTypesRequestDTO.maxPerPage,
      where: {
        status: EntityStatusEnum.ACTIVE,
        id: searchIncidentTypesRequestDTO.incidentTypeId,
        name: {
          contains: searchIncidentTypesRequestDTO.incidentTypeName,
          mode: 'insensitive',
        },
        description: {
          contains: searchIncidentTypesRequestDTO.incidentTypeDescription,
          mode: 'insensitive',
        },
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });
  }

  public async findIncidents(): Promise<(incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item})[]> {
    return await this.connection.incident.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async findIncidentTypes(): Promise<incident_type[]> {
    return await this.connection.incident_type.findMany({
      where: {
        status: EntityStatusEnum.ACTIVE,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  public async findIncidentInteractions(incidentId: number): Promise<(incident_interaction & { user: user | null })[]> {
    return await this.connection.incident_interaction.findMany({
      where: { incident_id: incidentId, },
      orderBy: [
        {
          id: 'asc',
        },
      ],
      include: {
        user: true,
      },
    });
  }

  public async markIncidentInteractionsAsRead(incident: IncidentEntity, origin: number): Promise<void> {
    await this.connection.incident_interaction.updateMany({
      where: { 
        incident_id: incident.id, 
        origin: origin,
      },
      data: {
        status: IncidentInteractionStatusEnum.READ,
      },
    });
  }

  public async findIncidentByID(
    id: number
  ): Promise<incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item} | null> {
    return await this.connection.incident.findUnique({ 
      where: { id: id },
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async findIncidentByIDAndStatus(
    id: number, 
    status: string | undefined
  ): Promise<incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item} | null> {
    return await this.connection.incident.findFirst({ 
      where: { 
        id: id,
        status: status,
      },
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async findIncidentTypeByID(id: number): Promise<incident_type | null> {
    return await this.connection.incident_type.findUnique({ where: { id: id } });
  }

  public async createIncident(
    createIncidentRequestDTO: CreateIncidentRequestDTO,
    fileMetadataId: number | null,
  ): Promise<incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item} | null> {
    return await this.connection.incident.create({ 
      data: {
        title: createIncidentRequestDTO.title,
        description: createIncidentRequestDTO.description,
        start_date: new Date(),
        status: IncidentStatusEnum.OPEN,
        type_id: createIncidentRequestDTO.incidentTypeId,
        location_id: createIncidentRequestDTO.locationId,
        item_id: createIncidentRequestDTO.itemId,
        user_id: createIncidentRequestDTO.userId,
        file_metadata_id: fileMetadataId,
        priority: createIncidentRequestDTO.priority,
      },
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async updateIncident(
    updateIncidentRequestDTO: UpdateIncidentRequestDTO,
    fileMetadataId: number | null,
  ): Promise<incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item} | null> {
    return await this.connection.incident.update({ 
      where: {
        id: updateIncidentRequestDTO.id,
      },
      data: {
        type_id: updateIncidentRequestDTO.incidentTypeId,
        location_id: updateIncidentRequestDTO.locationId,
        item_id: updateIncidentRequestDTO.itemId,
        file_metadata_id: fileMetadataId,
        title: updateIncidentRequestDTO.title,
        description: updateIncidentRequestDTO.description,
        priority: updateIncidentRequestDTO.priority,
      },
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async updateIncidentFile(
    incidentId: number,
    fileMetadataId: number | null,
  ): Promise<void> {
    await this.connection.incident.update({ 
      where: {
        id: incidentId,
      },
      data: {
        file_metadata_id: fileMetadataId,
      },
    });
  }

  public async createIncidentType(createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO): Promise<incident_type | null> {
    return await this.connection.incident_type.create({ 
      data: {
        name: createIncidentTypeRequestDTO.name,
        description: createIncidentTypeRequestDTO.description,
        status: EntityStatusEnum.ACTIVE,
      },
    });
  }

  public async assignIncidentToAdmin(
    userAdmin: UserEntity, 
    incident: IncidentEntity
  ): Promise<incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item} | null> {
    return await this.connection.incident.update({ 
      where: { id: incident.id },
      data: {
        admin_id: userAdmin.id,
        status: IncidentStatusEnum.PENDING,
      },
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async setIncidentStatus(
    incident: IncidentEntity,
    status: string,
    endDate: Date | null,
    rating: number,
  ): Promise<incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item} | null> {
    return await this.connection.incident.update({ 
      where: { id: incident.id },
      data: {
        status: status,
        end_date: endDate,
        rating: rating,
      },
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async setIncidentRating(
    incident: IncidentEntity,
    rating: number,
  ): Promise<incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item} | null> {
    return await this.connection.incident.update({ 
      where: { id: incident.id },
      data: {
        rating: rating,
      },
      include: {
        interactions: true,
        admin: true,
        user: true,
        incident_type: true,
        location: true,
        item: true,
      },
    });
  }

  public async updateIncidentType(updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO): Promise<incident_type | null> {
    return await this.connection.incident_type.update({ 
      where: { id: updateIncidentTypeRequestDTO.id },
      data: {
        name: updateIncidentTypeRequestDTO.name,
        description: updateIncidentTypeRequestDTO.description,
      },
    });
  }

  public async deleteIncidentType(incidentType: IncidentTypeEntity): Promise<void> {
    await this.connection.incident_type.update({ 
      where: { id: incidentType.id },
      data: {
        status: EntityStatusEnum.INACTIVE,
      },
    });
  }

  public async createIncidentInteraction(createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO): Promise<incident_interaction & {user: user | null} | null> {
    return await this.connection.incident_interaction.create({ 
      data: {
        description: createIncidentInteractionRequestDTO.description,
        incident_id: createIncidentInteractionRequestDTO.incidentId,
        user_id: createIncidentInteractionRequestDTO.userId,
        origin: createIncidentInteractionRequestDTO.origin,
        status: IncidentInteractionStatusEnum.SENT,
      },
      include: {
        user: true,
      },
    });
  }

  public async findTotalIncidentsByStatusForHomePage(status: string | undefined, userId: number | undefined ): Promise<number> {
    return await this.connection.incident.count({
      where: {
        status: status,
        user_id: userId,
      },
    });
  }

  public async findTotalIncidentTypes(): Promise<number> {
    return await this.connection.incident_type.count({where: {status: EntityStatusEnum.ACTIVE}});
  }

  public async findIncidentUnreadInteractions(incidentId: number, origin: number, userId: number): Promise<(incident_interaction & { user: user | null })[]> {
    return await this.connection.incident_interaction.findMany({ 
      where: { 
        incident_id: incidentId,
        OR: [
          {
            status: IncidentInteractionStatusEnum.SENT,
          },
          {
            status: IncidentInteractionStatusEnum.MAIL_SENT,
          },
        ],
        NOT: [
          {
            origin: origin,
          },
          {
            user_id: userId,
          },
        ],
      },
      include: {
        user: true,
      }
    });
  }

  public async findIncidentUnreadInteractionsByStatus(
    incidentStatus: string, 
    origin: number, 
    userId: number,
  ): Promise<number> {
    return await this.connection.incident.count({ 
      where: { 
        status: incidentStatus,
        interactions: {
          some: {
            OR: [
              {
                status: IncidentInteractionStatusEnum.SENT,
              },
              {
                status: IncidentInteractionStatusEnum.MAIL_SENT,
              },
            ],
            NOT: [
              {
                origin: origin,
              },
              {
                user_id: userId,
              },
            ],
          },
        },
      }
    });
  }

}