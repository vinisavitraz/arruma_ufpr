import { ApiProperty } from "@nestjs/swagger";
import { incident_type } from "@prisma/client";

export class IncidentTypeEntity {

  @ApiProperty({example: 1})
  readonly id: number;
  @ApiProperty({example: 'Manutenção'})
  readonly name: string;
  @ApiProperty({example: 'Item precisa de manutenção'})
  readonly description: string;

  constructor(
    id: number,
    name: string,
    description: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  public static fromRepository(incidentType: incident_type): IncidentTypeEntity {
    return new IncidentTypeEntity(
      incidentType.id,
      incidentType.name,
      incidentType.description,
    );
  }

}