import { ApiProperty } from "@nestjs/swagger";
import { LocationEntity } from "src/location/entity/location.entity";

export class ListLocationResponseDTO {

  @ApiProperty()
  readonly entity: LocationEntity;

  constructor(location: LocationEntity) {
    this.entity = location;
  }

}