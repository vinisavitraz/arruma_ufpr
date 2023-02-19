import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateIncidentTypeRequestDTO } from 'src/incident/dto/request/create-incident-type-request.dto';
import { UpdateIncidentTypeRequestDTO } from 'src/incident/dto/request/update-incident-type-request.dto';
import { IncidentTypeEntity } from 'src/incident/entity/incident-type.entity';
import { IncidentTypeService } from 'src/incident/service/incident-type.service';
import { IncidentTypesPageContent } from '../content/incident-types-page.content';
import { SearchIncidentTypesRequestDTO } from '../dto/request/search-incident-types-request.dto';

@Injectable()
export class DashboardIncidentTypeService {

  constructor(
    private readonly incidentTypeService: IncidentTypeService,
  ) {}

  public async findTotalIncidentTypes(): Promise<number> {
    return await this.incidentTypeService.findTotalIncidentTypes();
  }

  public async findIncidentTypes(
    incidentTypesPageContent: IncidentTypesPageContent,
  ): Promise<IncidentTypeEntity[]> {
    return await this.incidentTypeService.searchIncidentTypes(SearchIncidentTypesRequestDTO.fromPageContent(incidentTypesPageContent));
  }
  
  public async findIncidentTypeByIDOrCry(id: number): Promise<IncidentTypeEntity> {
    return await this.incidentTypeService.findIncidentTypeByIDOrCry(id);
  }

  public async createIncidentType(createIncidentTypeRequestDTO: CreateIncidentTypeRequestDTO): Promise<void> {
    await validateOrReject(createIncidentTypeRequestDTO);

    await this.incidentTypeService.createIncidentType(createIncidentTypeRequestDTO); 
  }

  public async updateIncidentType(updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO): Promise<void> {
    await validateOrReject(updateIncidentTypeRequestDTO);

    await this.incidentTypeService.updateIncidentType(updateIncidentTypeRequestDTO); 
  }

  public async deleteIncidentType(incidentTypeId: number): Promise<void> {
    await this.incidentTypeService.deleteIncidentType(incidentTypeId); 
  }

}
