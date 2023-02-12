import { IncidentTypesPageContent } from "src/dashboard/content/incident-types-page.content";

export class SearchIncidentTypesRequestDTO {

  incidentTypeId: number | undefined;
  incidentTypeName: string | undefined;
  incidentTypeDescription: string | undefined;
  skip: number | null;
  maxPerPage: number | null;

  public static fromPageContent(incidentTypesPageContent: IncidentTypesPageContent): SearchIncidentTypesRequestDTO {
    const searchIncidentTypesRequestDTO: SearchIncidentTypesRequestDTO = new SearchIncidentTypesRequestDTO();

    searchIncidentTypesRequestDTO.incidentTypeId = incidentTypesPageContent.incidentTypeId;
    searchIncidentTypesRequestDTO.incidentTypeName = incidentTypesPageContent.incidentTypeName;
    searchIncidentTypesRequestDTO.incidentTypeDescription = incidentTypesPageContent.incidentTypeDescription;
    searchIncidentTypesRequestDTO.skip = incidentTypesPageContent.skip;
    searchIncidentTypesRequestDTO.maxPerPage = incidentTypesPageContent.maxPerPage;

    return searchIncidentTypesRequestDTO;

  }

}