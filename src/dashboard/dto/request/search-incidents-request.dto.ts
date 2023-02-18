import { IncidentsPageContent } from "src/dashboard/content/incidents-page.content";

export class SearchIncidentsRequestDTO {

  incidentId: number | undefined;
  incidentTitle: string | undefined;
  incidentOpenDate: Date | undefined;
  incidentEndDate: Date | undefined;
  incidentUserName: string | undefined;
  incidentUserEmail: string | undefined;
  incidentTypeId: number | undefined;
  locationId: number | undefined;
  itemId: number | undefined;
  incidentStatus: string;
  origin: string;
  skip: number | null;
  maxPerPage: number | null;

  public static fromPageContent(incidentPageContent: IncidentsPageContent): SearchIncidentsRequestDTO {
    const searchIncidentsRequestDTO: SearchIncidentsRequestDTO = new SearchIncidentsRequestDTO();

    searchIncidentsRequestDTO.incidentId = incidentPageContent.incidentId;
    searchIncidentsRequestDTO.incidentStatus = incidentPageContent.incidentStatus;
    searchIncidentsRequestDTO.incidentTitle = incidentPageContent.incidentTitle;
    searchIncidentsRequestDTO.incidentOpenDate = incidentPageContent.incidentOpenDate;
    searchIncidentsRequestDTO.incidentEndDate = incidentPageContent.incidentEndDate;
    searchIncidentsRequestDTO.incidentUserName = incidentPageContent.incidentUserName;
    searchIncidentsRequestDTO.incidentUserEmail = incidentPageContent.incidentUserEmail;
    searchIncidentsRequestDTO.incidentTypeId = incidentPageContent.incidentTypeId;
    searchIncidentsRequestDTO.locationId = incidentPageContent.locationId;
    searchIncidentsRequestDTO.itemId = incidentPageContent.itemId;
    searchIncidentsRequestDTO.origin = incidentPageContent.origin;
    searchIncidentsRequestDTO.skip = incidentPageContent.skip;
    searchIncidentsRequestDTO.maxPerPage = incidentPageContent.maxPerPage;

    return searchIncidentsRequestDTO;

  }

  public static fromStatus(incidentStatus: string): SearchIncidentsRequestDTO {
    const searchIncidentsRequestDTO: SearchIncidentsRequestDTO = new SearchIncidentsRequestDTO();

    searchIncidentsRequestDTO.incidentStatus = incidentStatus;

    return searchIncidentsRequestDTO;
  }

}