import { SearchInputMorpher } from "src/app/util/seach-input.morpher";
import { DashboardPagination } from "../pagination/dashboard-pagination";

export class ItemsPageContent {

  maxPerPage: number;
  skip: number;
  total: number;
  searching: boolean;

  itemId: number | undefined;
  itemName: string | undefined;
  itemDescription: string | undefined;
  locationId: number | undefined;
  
  private constructor(
    maxPerPage: number,
    skip: number,
    total: number,
    searching: boolean,
    itemId: number | undefined,
    itemName: string | undefined,
    itemDescription: string | undefined,
    locationId: number | undefined,
  ) {
    this.maxPerPage = maxPerPage;
    this.skip = skip;
    this.total = total;
    this.searching = searching;
    this.itemId = itemId;
    this.itemName = itemName;
    this.itemDescription = itemDescription;
    this.locationId = locationId;
  }
  
  public static fromQueryParams(queryParams: any): ItemsPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const itemId: number | undefined = SearchInputMorpher.morphID(queryParams.itemId);
    const itemName: string | undefined = SearchInputMorpher.morphString(queryParams.itemName);
    const itemDescription: string | undefined = SearchInputMorpher.morphString(queryParams.itemDescription);
    const locationId: number | undefined = SearchInputMorpher.morphID(queryParams.locationId);

    return new ItemsPageContent(
      maxPerPage,
      skip,
      total,
      searching,
      itemId,
      itemName,
      itemDescription,
      locationId,
    );
  }

  public static fromSearch(queryParams: any): ItemsPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const itemId: number | undefined = SearchInputMorpher.morphID(queryParams.itemId);
    const itemName: string | undefined = SearchInputMorpher.morphString(queryParams.itemName);
    const itemDescription: string | undefined = SearchInputMorpher.morphString(queryParams.itemDescription);
    const locationId: number | undefined = SearchInputMorpher.morphID(queryParams.locationId);

    return new ItemsPageContent(
      maxPerPage,
      skip,
      total,
      searching,
      itemId,
      itemName,
      itemDescription,
      locationId,
    );
  }

}