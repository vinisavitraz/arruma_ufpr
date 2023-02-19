import { ApiProperty } from "@nestjs/swagger";
import { IncidentInteractionEntity } from "src/incident/entity/incident-interaction.entity";

export class ListIncidentInteractionsResponseDTO {

  @ApiProperty({ type: [IncidentInteractionEntity] })
  readonly entities: IncidentInteractionEntity[];

  constructor(incidentInteractions: IncidentInteractionEntity[]) {
    this.entities = incidentInteractions;
  }

}