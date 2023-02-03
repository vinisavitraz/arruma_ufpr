import { ApiProperty } from "@nestjs/swagger";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";

export class ListIncidentTypesResponseDTO {

  @ApiProperty({ type: [IncidentTypeEntity] })
  readonly incidentTypes: IncidentTypeEntity[];

  constructor(incidentTypes: IncidentTypeEntity[]) {
    this.incidentTypes = incidentTypes;
  }

}