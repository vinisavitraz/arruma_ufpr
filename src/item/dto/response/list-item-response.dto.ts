import { ApiProperty } from "@nestjs/swagger";
import { ItemEntity } from "src/item/entity/item.entity";

export class ListItemResponseDTO {

  @ApiProperty()
  readonly entity: ItemEntity;

  constructor(item: ItemEntity) {
    this.entity = item;
  }

}