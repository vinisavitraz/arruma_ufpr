import { ApiProperty } from "@nestjs/swagger";
import { incident } from "@prisma/client";

export class IncidentEntity {

  @ApiProperty({example: 1})
  readonly id: number;
  @ApiProperty({example: 'Manutenção'})
  readonly title: string;
  @ApiProperty({example: 'Item precisa de manutenção'})
  readonly description: string;
  @ApiProperty({example: '2023-01-01 00:00:00'})
  readonly startDate: Date;
  @ApiProperty({example: ''})
  readonly endDate: Date | null;
  @ApiProperty({example: 'Aberto'})
  readonly status: string;
  @ApiProperty({example: 1})
  readonly incidentTypeId: number;
  @ApiProperty({example: 1})
  readonly locationId: number;
  @ApiProperty({example: 1})
  readonly itemId: number;

  constructor(
    id: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date | null,
    status: string,
    incidentTypeId: number,
    locationId: number,
    itemId: number,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.incidentTypeId = incidentTypeId;
    this.locationId = locationId;
    this.itemId = itemId;
  }

  public static fromRepository(incident: incident): IncidentEntity {
    return new IncidentEntity(
      incident.id,
      incident.title,
      incident.description,
      incident.start_date,
      incident.end_date,
      incident.status,
      incident.type_id,
      incident.location_id,
      incident.item_id,
    );
  }

}