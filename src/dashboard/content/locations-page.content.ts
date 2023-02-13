import { SearchInputMorpher } from "src/app/util/seach-input.morpher";
import { DashboardPagination } from "../pagination/dashboard-pagination";

export class LocationsPageContent {

  maxPerPage: number;
  skip: number;
  total: number;
  searching: boolean;

  locationId: number | undefined;
  locationName: string | undefined;
  locationDescription: string | undefined;
  
  private constructor(
    maxPerPage: number,
    skip: number,
    total: number,
    searching: boolean,
    locationId: number | undefined,
    locationName: string | undefined,
    locationDescription: string | undefined,
  ) {
    this.maxPerPage = maxPerPage;
    this.skip = skip;
    this.total = total;
    this.searching = searching;
    this.locationId = locationId;
    this.locationName = locationName;
    this.locationDescription = locationDescription;
  }
  
  public static fromQueryParams(queryParams: any): LocationsPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const locationId: number | undefined = SearchInputMorpher.morphID(queryParams.locationId);
    const locationName: string | undefined = SearchInputMorpher.morphString(queryParams.locationName);
    const locationDescription: string | undefined = SearchInputMorpher.morphString(queryParams.locationDescription);
    

    return new LocationsPageContent(
      maxPerPage,
      skip,
      total,
      searching,
      locationId,
      locationName,
      locationDescription,
    );
  }

  public static fromSearch(queryParams: any): LocationsPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const locationId: number | undefined = SearchInputMorpher.morphID(queryParams.locationId);
    const locationName: string | undefined = SearchInputMorpher.morphString(queryParams.locationName);
    const locationDescription: string | undefined = SearchInputMorpher.morphString(queryParams.locationDescription);
    

    return new LocationsPageContent(
      maxPerPage,
      skip,
      total,
      searching,
      locationId,
      locationName,
      locationDescription,
    );
  }

}