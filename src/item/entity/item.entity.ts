import { ApiProperty } from "@nestjs/swagger";
import { item, location } from "@prisma/client";

export class ItemEntity {

  @ApiProperty({example: 1})
  readonly id: number;
  @ApiProperty({example: 'Projetor'})
  readonly name: string;
  @ApiProperty({example: 'Projetor Sala A12'})
  readonly description: string;
  @ApiProperty({example: 1})
  readonly locationId: number;
  @ApiProperty({example: 'SEPT'})
  readonly locationName: string;

  constructor(
    id: number,
    name: string,
    description: string,
    locationId: number,
    locationName: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.locationId = locationId;
    this.locationName = locationName;
  }

  public static fromRepository(item: item & { location: location }): ItemEntity {
    return new ItemEntity(
      item.id,
      item.name,
      item.description,
      item.location_id,
      item.location.name,
    );
  }

}