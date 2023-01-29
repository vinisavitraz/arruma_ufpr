import { item } from "@prisma/client";

export class ItemEntity {

  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly status: string;

  constructor(
    id: number,
    name: string,
    description: string,
    status: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
  }

  public static fromRepository(item: item): ItemEntity {
    return new ItemEntity(
      item.id,
      item.name,
      item.description,
      item.status,
    );
  }

}