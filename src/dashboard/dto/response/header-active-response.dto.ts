export class HeaderActiveResponseDTO {

  readonly home: string;
  readonly incident: string;
  readonly userIncident: string;
  readonly incidentType: string;
  readonly location: string;
  readonly item: string;
  readonly user: string;

  constructor(
    home: string,
    incident: string,
    userIncident: string,
    incidentType: string,
    location: string,
    item: string,
    user: string,
  ) {
    this.home = home;
    this.incident = incident;
    this.userIncident = userIncident;
    this.incidentType = incidentType;
    this.location = location;
    this.item = item;
    this.user = user;
  }

}