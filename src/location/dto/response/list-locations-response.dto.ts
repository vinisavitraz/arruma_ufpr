import { ApiProperty } from "@nestjs/swagger";
import { LocationEntity } from "src/location/entity/location.entity";

export class ListLocationsResponseDTO {

  @ApiProperty({ type: [LocationEntity] })
  readonly entities: LocationEntity[];

  constructor(locations: LocationEntity[]) {
    this.entities = locations;
  }

}