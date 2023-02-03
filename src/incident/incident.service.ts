import { HttpStatus, Injectable } from '@nestjs/common';
import { incident, incident_type } from '@prisma/client';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { CreateIncidentRequestDTO } from './dto/request/create-incident-request.dto';
import { CreateIncidentTypeRequestDTO } from './dto/request/create-incident-type-request.dto';
import { UpdateIncidentTypeRequestDTO } from './dto/request/update-incident-type-request.dto';
import { IncidentTypeEntity } from './entity/incident-type.entity';
import { IncidentEntity } from './entity/incident.entity';
import { IncidentRepository } from './incident.repository';

@Injectable()
export class IncidentService {

  private repository: IncidentRepository;

  constructor(private databaseService: DatabaseService) {
      this.repository = new IncidentRepository(this.databaseService);
  }

  public async findIncidents(): Promise<IncidentEntity[]> {
    const incidentDb: incident[] = await this.repository.findIncidents();

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

}
