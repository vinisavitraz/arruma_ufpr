import { LocationEntity } from "src/location/entity/location.entity";

export class ListLocationsResponseDTO {

  readonly locations: LocationEntity[];

  constructor(locations: LocationEntity[]) {
    this.locations = locations;
  }

}