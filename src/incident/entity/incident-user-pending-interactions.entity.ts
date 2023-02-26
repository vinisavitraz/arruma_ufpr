import { ApiProperty } from "@nestjs/swagger";

export class IncidentUserPendingInteractionsEntity {

  @ApiProperty({example: 'john.doe@mail.com'})
  readonly email: string;
  @ApiProperty({example: 1})
  readonly totalUnreadInteractions: number;

  constructor(
    email: string,
    totalUnreadInteractions: number,
  ) {
    this.email = email;
    this.totalUnreadInteractions = totalUnreadInteractions;
  }

  public static fromRepository(
    email: string,
    totalUnreadInteractions: number,
  ): IncidentUserPendingInteractionsEntity {
    return new IncidentUserPendingInteractionsEntity(
      email,
      totalUnreadInteractions,
    );
  }

}