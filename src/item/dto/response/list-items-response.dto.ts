import { ApiProperty } from "@nestjs/swagger";
import { ItemEntity } from "src/item/entity/item.entity";

export class ListItemsResponseDTO {

  @ApiProperty({ type: [ItemEntity] })
  readonly entities: ItemEntity[];

  constructor(items: ItemEntity[]) {
    this.entities = items;
  }

}