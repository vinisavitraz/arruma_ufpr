import { incident, incident_type } from "@prisma/client";
import { IncidentStatusEnum } from "src/app/enum/status.enum";
import { DatabaseService } from "src/database/database.service";
import { UserEntity } from "src/user/entity/user.entity";
import { CreateIncidentRequestDTO } from "./dto/request/create-incident-request.dto";
import { CreateIncidentTypeRequestDTO } from "./dto/request/create-incident-type-request.dto";
import { UpdateIncidentTypeRequestDTO } from "./dto/request/update-incident-type-request.dto";
import { IncidentTypeEntity } from "./entity/incident-type.entity";

export class IncidentRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async findIncidents(): Promise<incident[]> {
    return await this.connection.incident.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  public async findUserIncidents(user: UserEntity): Promise<incident[]> {
    return await this.connection.incident.findMany({
      where: {
        user_id: user.id,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
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

  public async findIncidentByID(id: number): Promise<incident | null> {
    return await this.connection.incident.findUnique({ where: { id: id } });
  }

  public async findIncidentTypeByID(id: number): Promise<incident_type | null> {
    return await this.connection.incident_type.findUnique({ where: { id: id } });
  }

  public async createIncident(createIncidentRequestDTO: CreateIncidentRequestDTO): Promise<incident | null> {
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
  
}