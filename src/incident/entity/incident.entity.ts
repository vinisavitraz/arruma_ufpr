import { ApiProperty } from "@nestjs/swagger";
import { incident, incident_interaction, incident_type, item, location, user } from "@prisma/client";

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
  @ApiProperty({example: 'Manutenção'})
  readonly incidentTypeName: string;
  @ApiProperty({example: 1})
  readonly locationId: number;
  @ApiProperty({example: 'SEPT'})
  readonly locationName: string;
  @ApiProperty({example: 1})
  readonly itemId: number;
  @ApiProperty({example: 'Projetor'})
  readonly itemName: string;
  @ApiProperty({example: 1})
  readonly userId: number;
  @ApiProperty({example: 'John Doe'})
  readonly userName: string;
  @ApiProperty({example: 1})
  readonly adminId: number | null;
  @ApiProperty({example: 'John Doe'})
  readonly adminName: string | null;
  @ApiProperty({example: 1})
  readonly totalInteractions: number;

  constructor(
    id: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date | null,
    status: string,
    incidentTypeId: number,
    incidentTypeName: string,
    locationId: number,
    locationName: string,
    itemId: number,
    itemName: string,
    userId: number,
    userName: string,
    adminId: number | null,
    adminName: string | null,
    totalInteractions: number,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.incidentTypeId = incidentTypeId;
    this.incidentTypeName = incidentTypeName;
    this.locationId = locationId;
    this.locationName = locationName;
    this.itemId = itemId;
    this.itemName = itemName;
    this.userId = userId;
    this.userName = userName;
    this.adminId = adminId;
    this.adminName = adminName;
    this.totalInteractions = totalInteractions;
  }

  public static fromRepository(incident: incident & {interactions: incident_interaction[], admin: user | null, user: user, incident_type: incident_type, location: location, item: item}): IncidentEntity {
    return new IncidentEntity(
      incident.id,
      incident.title,
      incident.description,
      incident.start_date,
      incident.end_date,
      incident.status,
      incident.type_id,
      incident.incident_type.name,
      incident.location_id,
      incident.location.name,
      incident.item_id,
      incident.item.name,
      incident.user_id,
      incident.user.name,
      incident.admin_id,
      incident.admin ? incident.admin.name : null,
      incident.interactions.length,
    );
  }

}