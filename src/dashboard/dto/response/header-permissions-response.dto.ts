export class HeaderPermissionsResponseDTO {

  readonly showMenuIncidents: boolean;
  readonly showMenuMyIncidents: boolean;
  readonly showMenuIncidentTypes: boolean;
  readonly showMenuLocations: boolean;
  readonly showMenuItems: boolean;

  constructor(
    showMenuIncidents: boolean,
    showMenuMyIncidents: boolean,
    showMenuIncidentTypes: boolean,
    showMenuLocations: boolean,
    showMenuItems: boolean,
  ) {
    this.showMenuIncidents = showMenuIncidents;
    this.showMenuMyIncidents = showMenuMyIncidents;
    this.showMenuIncidentTypes = showMenuIncidentTypes;
    this.showMenuLocations = showMenuLocations;
    this.showMenuItems = showMenuItems;
  }

}