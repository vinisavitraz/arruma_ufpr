import { ApiProperty } from "@nestjs/swagger";
import { IncidentEntity } from "src/incident/entity/incident.entity";

export class ListIncidentResponseDTO {

  @ApiProperty()
  readonly entity: IncidentEntity;

  constructor(incident: IncidentEntity) {
    this.entity = incident;
  }

}