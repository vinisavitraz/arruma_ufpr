export class HeaderPermissionsResponseDTO {

  readonly showMenuIncidents: boolean;
  readonly showMenuUserIncidents: boolean;
  readonly showMenuIncidentTypes: boolean;
  readonly showMenuLocations: boolean;
  readonly showMenuItems: boolean;
  readonly showMenuUsers: boolean;

  constructor(
    showMenuIncidents: boolean,
    showMenuUserIncidents: boolean,
    showMenuIncidentTypes: boolean,
    showMenuLocations: boolean,
    showMenuItems: boolean,
    showMenuUsers: boolean,
  ) {
    this.showMenuIncidents = showMenuIncidents;
    this.showMenuUserIncidents = showMenuUserIncidents;
    this.showMenuIncidentTypes = showMenuIncidentTypes;
    this.showMenuLocations = showMenuLocations;
    this.showMenuItems = showMenuItems;
    this.showMenuUsers = showMenuUsers;
  }

}