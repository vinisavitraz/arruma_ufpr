import { incident, incident_interaction, incident_type, item, location, user } from "@prisma/client";
import { RoleEnum } from "src/app/enum/role.enum";
import { IncidentStatusEnum } from "src/app/enum/status.enum";
import { SearchIncidentsRequestDTO } from "src/dashboard/dto/request/search-incidents-request.dto";
import { DatabaseService } from "src/database/database.service";
import { UserEntity } from "src/user/entity/user.entity";
import { CreateIncidentInteractionRequestDTO } from "./dto/request/create-incident-interaction-request.dto";
import { CreateIncidentRequestDTO } from "./dto/request/create-incident-request.dto";
import { CreateIncidentTypeRequestDTO } from "./dto/request/create-incident-type-request.dto";
import { UpdateIncidentTypeRequestDTO } from "./dto/request/update-incident-type-request.dto";
import { IncidentTypeEntity } from "./entity/incident-type.entity";
import { IncidentEntity } from "./entity/incident.entity";

export class IncidentRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async findIncidentsByStatus(
    status: string | undefined,
    skip: number,
    take: number,
  ): Promise<(incident & {interactions: incident_interaction[], admin: user | null, user: user})[]> {
    return await this.connection.incident.findMany({
      where: {
        status: status,
      },
      skip: skip,
      take: take,
      orderBy: [
        {
          id: 'desc',
        },
      ],
      include: {
        interactions: true,
        admin: true,
        user: true,
      },
    });
  }

  public async findUserIncidentsByStatus(
    user: UserEntity, 
    status: string | undefined,
    skip: number,
    take: number,
  ): Promise<(incident & {interactions: incident_interaction[], admin: user | null, user: user})[]> {
    let where: any = {};

    if (user.role === RoleEnum.ADMIN) {
      where = {
        admin_id: user.id,
        status: status,
      };
    } else {
      where = {
        user_id: user.id,
        status: status,
      };
    }
    
    return await this.connection.incident.findMany({
      where: where,
      skip: skip,
      take: take,
      orderBy: [
        {
          id: 'desc',
        },
      ],
      include: {
        interactions: true,
        admin: true,
        user: true,
      },
    });
  }

  public async searchIncidents(
    searchIncidentsRequestDTO: SearchIncidentsRequestDTO,
    user: UserEntity | null,
  ): Promise<(incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item})[]> {
    return await this.connection.incident.findMany({
      skip: searchIncidentsRequestDTO.skip,
      take: searchIncidentsRequestDTO.maxPerPage,
      where: {
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
        user_id: user === null ? undefined : (user.role === RoleEnum.USER ? user.id : undefined),
        admin_id: user === null ? undefined : (user.role === RoleEnum.ADMIN ? user.id : undefined),
      },
      orderBy: [
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

  public async findIncidentTypes(): Promise<incident_type[]> {
    return await this.connection.incident_type.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  public async findIncidentInteractions(incidentId: number): Promise<(incident_interaction & { user: user })[]> {
    return await this.connection.incident_interaction.findMany({
      where: { incident_id: incidentId, },
      orderBy: [
        {
          id: 'desc',
        },
      ],
      include: {
        user: true,
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
    createIncidentRequestDTO: CreateIncidentRequestDTO
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

  public async createIncidentType(createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO): Promise<incident_type | null> {
    return await this.connection.incident_type.create({ 
      data: {
        name: createIncidentTypeRequestDTO.name,
        description: createIncidentTypeRequestDTO.description,
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

  public async setIncidentToClosed(
    incident: IncidentEntity
  ): Promise<incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item} | null> {
    return await this.connection.incident.update({ 
      where: { id: incident.id },
      data: {
        status: IncidentStatusEnum.CLOSED,
        end_date: new Date(),
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
    await this.connection.incident_type.delete({where: { id: incidentType.id }});
  }

  public async createIncidentInteraction(createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO): Promise<incident_interaction & {user: user} | null> {
    return await this.connection.incident_interaction.create({ 
      data: {
        description: createIncidentInteractionRequestDTO.description,
        incident_id: createIncidentInteractionRequestDTO.incidentId,
        user_id: createIncidentInteractionRequestDTO.userId,
        origin: createIncidentInteractionRequestDTO.origin,
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
    return await this.connection.incident_type.count();
  }
  
}