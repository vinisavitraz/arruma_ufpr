import { item } from "@prisma/client";

export class ItemEntity {

  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly locationId: number;

  constructor(
    id: number,
    name: string,
    description: string,
    locationId: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.locationId = locationId;
  }

  public static fromRepository(item: item): ItemEntity {
    return new ItemEntity(
      item.id,
      item.name,
      item.description,
      item.location_id,
    );
  }

}