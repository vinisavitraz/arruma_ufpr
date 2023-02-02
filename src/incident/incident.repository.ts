import { incident_type } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { CreateIncidentTypeRequestDTO } from "./dto/request/create-incident-type-request.dto";
import { UpdateIncidentTypeRequestDTO } from "./dto/request/update-incident-type-request.dto";
import { IncidentTypeEntity } from "./entity/incident-type.entity";

export class IncidentRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
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

  public async findIncidentTypeByID(id: number): Promise<incident_type | null> {
    return await this.connection.incident_type.findUnique({ where: { id: id } });
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