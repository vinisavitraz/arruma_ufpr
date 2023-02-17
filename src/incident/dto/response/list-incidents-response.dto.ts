import { ApiProperty } from "@nestjs/swagger";
import { IncidentEntity } from "src/incident/entity/incident.entity";

export class ListIncidentsResponseDTO {

  @ApiProperty({ type: [IncidentEntity] })
  readonly incidents: IncidentEntity[];

  constructor(incidents: IncidentEntity[]) {
    this.incidents = incidents;
  }

}