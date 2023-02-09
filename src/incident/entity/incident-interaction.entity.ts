import { ApiProperty } from "@nestjs/swagger";
import { incident_interaction, user } from "@prisma/client";

export class IncidentInteractionEntity {

  @ApiProperty({example: 1})
  readonly id: number;
  @ApiProperty({example: 'Item continua quebrado'})
  readonly description: string;
  @ApiProperty({example: '2023-01-01 10:00:00'})
  readonly sentDate: Date;
  @ApiProperty({example: 1})
  readonly origin: number;
  @ApiProperty({example: 1})
  readonly userId: number;
  @ApiProperty({example: 'John Doe'})
  readonly userName: string;
  @ApiProperty({example: 1})
  readonly incidentId: number;

  constructor(
    id: number,
    description: string,
    sentDate: Date,
    origin: number,
    userId: number,
    userName: string,
    incidentId: number,
  ) {
    this.id = id;
    this.description = description;
    this.sentDate = sentDate;
    this.origin = origin;
    this.userId = userId;
    this.userName = userName;
    this.incidentId = incidentId;
  }

  public static fromRepository(incidentInteraction: incident_interaction & {user: user}): IncidentInteractionEntity {
    return new IncidentInteractionEntity(
      incidentInteraction.id,
      incidentInteraction.description,
      incidentInteraction.sent_date,
      incidentInteraction.origin,
      incidentInteraction.user_id,
      incidentInteraction.user.name,
      incidentInteraction.incident_id,
    );
  }

}