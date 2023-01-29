import { LocationEntity } from "src/location/entity/location.entity";

export class ListLocationResponseDTO {

  readonly location: LocationEntity;

  constructor(location: LocationEntity) {
    this.location = location;
  }

}