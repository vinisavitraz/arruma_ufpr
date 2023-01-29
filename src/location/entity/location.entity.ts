import { item } from "@prisma/client";

export class LocationEntity {

  readonly id: number;
  readonly name: string;
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

  public static fromRepository(location: item): LocationEntity {
    return new LocationEntity(
      location.id,
      location.name,
      location.description,
    );
  }

}