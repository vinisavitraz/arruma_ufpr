import { SearchInputMorpher } from "src/app/util/seach-input.morpher";
import { DashboardPagination } from "../pagination/dashboard-pagination";

export class IncidentsPageContent {

  origin: string;
  maxPerPage: number;
  skip: number;
  total: number;
  searching: boolean;

  incidentStatus: string | undefined;
  incidentId: number | undefined;
  incidentTitle: string | undefined;
  incidentOpenDate: Date | undefined;
  incidentEndDate: Date | undefined;
  incidentUserName: string | undefined;
  incidentUserEmail: string | undefined;
  incidentTypeId: number | undefined;
  locationId: number | undefined;
  itemId: number | undefined;
  
  private constructor(
    origin: string,
    maxPerPage: number,
    skip: number,
    total: number,
    searching: boolean,
    incidentId: number | undefined,
    incidentStatus: string | undefined,
    incidentTitle: string | undefined,
    incidentOpenDate: Date | undefined,
    incidentEndDate: Date | undefined,
    incidentUserName: string | undefined,
    incidentUserEmail: string | undefined,
    incidentTypeId: number | undefined,
    locationId: number | undefined,
    itemId: number | undefined,
  ) {
    this.origin = origin;
    this.maxPerPage = maxPerPage;
    this.skip = skip;
    this.total = total;
    this.searching = searching;
    this.incidentId = incidentId;
    this.incidentStatus = incidentStatus;
    this.incidentTitle = incidentTitle;
    this.incidentOpenDate = incidentOpenDate;
    this.incidentEndDate = incidentEndDate;
    this.incidentUserName = incidentUserName;
    this.incidentUserEmail = incidentUserEmail;
    this.incidentTypeId = incidentTypeId;
    this.locationId = locationId;
    this.itemId = itemId;
  }
  
  public static fromQueryParams(origin: string, queryParams: any): IncidentsPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const incidentId: number | undefined = SearchInputMorpher.morphID(queryParams.incidentId);
    const incidentStatus: string | undefined = SearchInputMorpher.morphString(queryParams.incidentStatus);
    const incidentTitle: string | undefined = SearchInputMorpher.morphString(queryParams.incidentTitle);
    const incidentOpenDate: Date | undefined = SearchInputMorpher.morphDateString(queryParams.incidentOpenDate);
    const incidentEndDate: Date | undefined = SearchInputMorpher.morphDateString(queryParams.incidentEndDate);
    const incidentUserName: string | undefined = SearchInputMorpher.morphString(queryParams.incidentUserName);
    const incidentUserEmail: string | undefined = SearchInputMorpher.morphString(queryParams.incidentUserEmail);
    const incidentTypeId: number | undefined  = SearchInputMorpher.morphNumber(queryParams.incidentTypeId);
    const locationId: number | undefined  = SearchInputMorpher.morphNumber(queryParams.locationId);
    const itemId: number | undefined  = SearchInputMorpher.morphNumber(queryParams.itemId);
    

    return new IncidentsPageContent(
      origin,
      maxPerPage,
      skip,
      total,
      searching,
      incidentId,
      incidentStatus,
      incidentTitle,
      incidentOpenDate,
      incidentEndDate,
      incidentUserName,
      incidentUserEmail,
      incidentTypeId,
      locationId,
      itemId,
    );
  }

  public static fromSearch(queryParams: any): IncidentsPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const incidentId: number | undefined = SearchInputMorpher.morphID(queryParams.incidentId);
    const origin: string | undefined = SearchInputMorpher.morphString(queryParams.origin);
    const incidentStatus: string | undefined = SearchInputMorpher.morphString(queryParams.incidentStatus);
    const incidentTitle: string | undefined = SearchInputMorpher.morphString(queryParams.incidentTitle);
    const incidentOpenDate: Date | undefined = SearchInputMorpher.morphDateString(queryParams.incidentOpenDate);
    const incidentEndDate: Date | undefined = SearchInputMorpher.morphDateString(queryParams.incidentEndDate);
    const incidentUserName: string | undefined = SearchInputMorpher.morphString(queryParams.incidentUserName);
    const incidentUserEmail: string | undefined = SearchInputMorpher.morphString(queryParams.incidentUserEmail);
    const incidentTypeId: number | undefined  = SearchInputMorpher.morphNumber(queryParams.incidentTypeId);
    const locationId: number | undefined  = SearchInputMorpher.morphNumber(queryParams.locationId);
    const itemId: number | undefined  = SearchInputMorpher.morphNumber(queryParams.itemId);
    

    return new IncidentsPageContent(
      origin,
      maxPerPage,
      skip,
      total,
      searching,
      incidentId,
      incidentStatus,
      incidentTitle,
      incidentOpenDate,
      incidentEndDate,
      incidentUserName,
      incidentUserEmail,
      incidentTypeId,
      locationId,
      itemId,
    );
  }

}