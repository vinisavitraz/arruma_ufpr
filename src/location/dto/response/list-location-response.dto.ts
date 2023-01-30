import { ApiProperty } from "@nestjs/swagger";
import { LocationEntity } from "src/location/entity/location.entity";

export class ListLocationResponseDTO {

  @ApiProperty()
  readonly location: LocationEntity;

  constructor(location: LocationEntity) {
    this.location = location;
  }

}