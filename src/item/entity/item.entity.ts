import { item } from "@prisma/client";

export class ItemEntity {

  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly status: string;
  readonly locationId: number;

  constructor(
    id: number,
    name: string,
    description: string,
    status: string,
    locationId: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.locationId = locationId;
  }

  public static fromRepository(item: item): ItemEntity {
    return new ItemEntity(
      item.id,
      item.name,
      item.description,
      item.status,
      item.location_id,
    );
  }

}