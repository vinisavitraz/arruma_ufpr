import { ApiProperty } from "@nestjs/swagger";
import { IncidentInteractionEntity } from "src/incident/entity/incident-interaction.entity";

export class ListIncidentInteractionResponseDTO {

  @ApiProperty()
  readonly entity: IncidentInteractionEntity;

  constructor(incidentInteractionEntity: IncidentInteractionEntity) {
    this.entity = incidentInteractionEntity;
  }

}