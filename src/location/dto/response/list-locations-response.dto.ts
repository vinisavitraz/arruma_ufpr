import { ApiProperty } from "@nestjs/swagger";
import { LocationEntity } from "src/location/entity/location.entity";

export class ListLocationsResponseDTO {

  @ApiProperty({ type: [LocationEntity] })
  readonly locations: LocationEntity[];

  constructor(locations: LocationEntity[]) {
    this.locations = locations;
  }

}