import { ApiProperty } from "@nestjs/swagger";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";

export class ListIncidentTypesResponseDTO {

  @ApiProperty({ type: [IncidentTypeEntity] })
  readonly entities: IncidentTypeEntity[];

  constructor(incidentTypes: IncidentTypeEntity[]) {
    this.entities = incidentTypes;
  }

}