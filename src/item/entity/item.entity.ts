import { item, location } from "@prisma/client";

export class ItemEntity {

  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly locationId: number;
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