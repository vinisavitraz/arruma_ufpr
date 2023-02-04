import { ApiProperty } from "@nestjs/swagger";
import { IncidentEntity } from "src/incident/entity/incident.entity";

export class ListIncidentResponseDTO {

  @ApiProperty()
  readonly incident: IncidentEntity;

  constructor(incident: IncidentEntity) {
    this.incident = incident;
  }

}