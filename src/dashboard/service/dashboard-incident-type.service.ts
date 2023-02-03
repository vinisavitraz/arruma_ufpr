import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateIncidentTypeRequestDTO } from 'src/incident/dto/request/create-incident-type-request.dto';
import { UpdateIncidentTypeRequestDTO } from 'src/incident/dto/request/update-incident-type-request.dto';
import { IncidentTypeEntity } from 'src/incident/entity/incident-type.entity';
import { IncidentService } from 'src/incident/incident.service';

@Injectable()
export class DashboardIncidentTypeService {

  constructor(
    private readonly incidentService: IncidentService,
  ) {}

  public async findIncidentTypes(): Promise<IncidentTypeEntity[]> {
    return await this.incidentService.findIncidentTypes();
  }

  public async findIncidentTypeByIDOrCry(id: number): Promise<IncidentTypeEntity> {
    return await this.incidentService.findIncidentTypeByIDOrCry(id);
  }

  public async createIncidentType(createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO): Promise<void> {
    await validateOrReject(createIncidentTypeRequestDTO);

    await this.incidentService.createIncidentType(createIncidentTypeRequestDTO); 
  }

  public async updateIncidentType(updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO): Promise<void> {
    await validateOrReject(updateIncidentTypeRequestDTO);

    await this.incidentService.updateIncidentType(updateIncidentTypeRequestDTO); 
  }

  public async deleteIncidentType(incidentTypeId: number): Promise<void> {
    await this.incidentService.deleteIncidentType(incidentTypeId); 
  }

}
