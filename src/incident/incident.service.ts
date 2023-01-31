import { HttpStatus, Injectable } from '@nestjs/common';
import { incident_type } from '@prisma/client';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { CreateIncidentTypeRequestDTO } from './dto/request/create-incident-type-request.dto';
import { IncidentTypeEntity } from './entity/incident-type.entity';
import { IncidentRepository } from './incident.repository';

@Injectable()
export class IncidentService {

  private repository: IncidentRepository;

  constructor(private databaseService: DatabaseService) {
      this.repository = new IncidentRepository(this.databaseService);
  }

  public async findIncidentTypes(): Promise<IncidentTypeEntity[]> {
    const incidentTypesDb: incident_type[] = await this.repository.findIncidentTypes();

    return incidentTypesDb.map((incidentType: incident_type) => {
      return IncidentTypeEntity.fromRepository(incidentType);
    });
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

  public async createIncidentType(createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO): Promise<IncidentTypeEntity> {
    const incidentTypeDb: incident_type = await this.repository.createIncidentType(createIncidentTypeRequestDTO);

    return IncidentTypeEntity.fromRepository(incidentTypeDb);
  }

  public async deleteIncidentType(incidentTypeId: number): Promise<void> {
    const incidentType: IncidentTypeEntity = await this.findIncidentTypeByIDOrCry(incidentTypeId);

    await this.repository.deleteIncidentType(incidentType);
  }

}
