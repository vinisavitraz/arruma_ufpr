import { ApiProperty } from "@nestjs/swagger";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";

export class ListIncidentTypeResponseDTO {

  @ApiProperty()
  readonly entity: IncidentTypeEntity;

  constructor(incidentType: IncidentTypeEntity) {
    this.entity = incidentType;
  }

}