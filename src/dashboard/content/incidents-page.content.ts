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
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);;
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

  // public static fromDashboard(payload: any, user: UserEntity): IncidentsPageContent {
  //   const searchIncidentsRequestDTO: IncidentsPageContent = new IncidentsPageContent();

  //   const incidentId: number = SearchInputMorpher.morphNumber(payload['incidentId']);
  //   searchIncidentsRequestDTO.incidentId = incidentId > 0 ? incidentId : undefined;
  //   searchIncidentsRequestDTO.incidentTitle = SearchInputMorpher.morphString(payload['incidentTitle']);
  //   searchIncidentsRequestDTO.incidentOpenDate = SearchInputMorpher.morphDateString(payload['incidentOpenDate']);
  //   searchIncidentsRequestDTO.incidentEndDate = SearchInputMorpher.morphDateString(payload['incidentEndDate']);
  //   searchIncidentsRequestDTO.incidentUserName = SearchInputMorpher.morphString(payload['incidentUserName']);
  //   searchIncidentsRequestDTO.incidentUserEmail = SearchInputMorpher.morphString(payload['incidentUserEmail']);
  //   searchIncidentsRequestDTO.incidentTypeId = SearchInputMorpher.morphNumber(payload['incidentTypeId']);
  //   searchIncidentsRequestDTO.locationId = SearchInputMorpher.morphNumber(payload['locationId']);
  //   searchIncidentsRequestDTO.itemId = SearchInputMorpher.morphNumber(payload['itemId']);
  //   searchIncidentsRequestDTO.incidentStatus = SearchInputMorpher.morphString(payload['incidentStatus']);
  //   searchIncidentsRequestDTO.origin = SearchInputMorpher.morphString(payload['origin']) ?? '';
  //   searchIncidentsRequestDTO.skip = SearchInputMorpher.morphNumber(payload['skip']);
  //   searchIncidentsRequestDTO.maxPerPage = SearchInputMorpher.morphNumber(payload['maxPerPage']);

  //   return searchIncidentsRequestDTO;
  // }

  // public static fromEmptySearch(
  //   incidentStatus: string, 
  //   origin: string,
  //   total: number,
  //   maxPerPage: number | null,
  //   skip: number | null,
  // ): IncidentsPageContent {
  //   maxPerPage = maxPerPage ?? DashboardPagination.MAX_PER_PAGE;
  //   skip = skip ?? DashboardPagination.DEFAULT_SKIP;

  //   const searchIncidentsRequestDTO: IncidentsPageContent = new IncidentsPageContent();

  //   searchIncidentsRequestDTO.incidentStatus = incidentStatus;
  //   searchIncidentsRequestDTO.origin = origin;
  //   searchIncidentsRequestDTO.total = total;
  //   searchIncidentsRequestDTO.maxPerPage = maxPerPage;
  //   searchIncidentsRequestDTO.skip = skip;
    
  //   return searchIncidentsRequestDTO;

  // }

}