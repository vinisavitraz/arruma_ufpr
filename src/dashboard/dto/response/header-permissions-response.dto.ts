export class HeaderPermissionsResponseDTO {

  readonly showMenuIncidents: boolean;
  readonly showMenuMyIncidents: boolean;
  readonly showMenuIncidentTypes: boolean;
  readonly showMenuLocations: boolean;
  readonly showMenuItems: boolean;
  readonly showMenuUsers: boolean;

  constructor(
    showMenuIncidents: boolean,
    showMenuMyIncidents: boolean,
    showMenuIncidentTypes: boolean,
    showMenuLocations: boolean,
    showMenuItems: boolean,
    showMenuUsers: boolean,
  ) {
    this.showMenuIncidents = showMenuIncidents;
    this.showMenuMyIncidents = showMenuMyIncidents;
    this.showMenuIncidentTypes = showMenuIncidentTypes;
    this.showMenuLocations = showMenuLocations;
    this.showMenuItems = showMenuItems;
    this.showMenuUsers = showMenuUsers;
  }

}