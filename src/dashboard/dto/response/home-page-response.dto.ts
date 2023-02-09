export class HomePageResponseDTO {

  readonly totalOpenIncidents: number;
  readonly totalPendingIncidents: number;
  readonly totalClosedIncidents: number;
  readonly totalIncidents: number;
  readonly totalIncidentTypes: number;
  readonly totalLocations: number;
  readonly totalItems: number;
  readonly totalUsers: number;
  
  constructor(
    totalOpenIncidents: number,
    totalPendingIncidents: number,
    totalClosedIncidents: number,
    totalIncidents: number,
    totalIncidentTypes: number,
    totalLocations: number,
    totalItems: number,
    totalUsers: number,
  ) {
    this.totalOpenIncidents = totalOpenIncidents;
    this.totalPendingIncidents = totalPendingIncidents;
    this.totalClosedIncidents = totalClosedIncidents;
    this.totalIncidents = totalIncidents;
    this.totalIncidentTypes = totalIncidentTypes;
    this.totalLocations = totalLocations;
    this.totalItems = totalItems;
    this.totalUsers = totalUsers;
  }

}