import { SearchInputMorpher } from "src/app/util/seach-input.morpher";
import { DashboardPagination } from "../pagination/dashboard-pagination";

export class IncidentTypesPageContent {

  maxPerPage: number;
  skip: number;
  total: number;
  searching: boolean;

  incidentTypeId: number | undefined;
  incidentTypeName: string | undefined;
  incidentTypeDescription: string | undefined;
  
  private constructor(
    maxPerPage: number,
    skip: number,
    total: number,
    searching: boolean,
    incidentTypeId: number | undefined,
    incidentTypeName: string | undefined,
    incidentTypeDescription: string | undefined,
  ) {
    this.maxPerPage = maxPerPage;
    this.skip = skip;
    this.total = total;
    this.searching = searching;
    this.incidentTypeId = incidentTypeId;
    this.incidentTypeName = incidentTypeName;
    this.incidentTypeDescription = incidentTypeDescription;
  }
  
  public static fromQueryParams(queryParams: any): IncidentTypesPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const incidentTypeId: number | undefined = SearchInputMorpher.morphID(queryParams.incidentTypeId);
    const incidentTypeName: string | undefined = SearchInputMorpher.morphString(queryParams.incidentTypeName);
    const incidentTypeDescription: string | undefined = SearchInputMorpher.morphString(queryParams.incidentTypeDescription);
    

    return new IncidentTypesPageContent(
      maxPerPage,
      skip,
      total,
      searching,
      incidentTypeId,
      incidentTypeName,
      incidentTypeDescription,
    );
  }

  public static fromSearch(queryParams: any): IncidentTypesPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const incidentTypeId: number | undefined = SearchInputMorpher.morphID(queryParams.incidentTypeId);
    const incidentTypeName: string | undefined = SearchInputMorpher.morphString(queryParams.incidentTypeName);
    const incidentTypeDescription: string | undefined = SearchInputMorpher.morphString(queryParams.incidentTypeDescription);
    

    return new IncidentTypesPageContent(
      maxPerPage,
      skip,
      total,
      searching,
      incidentTypeId,
      incidentTypeName,
      incidentTypeDescription,
    );
  }

}