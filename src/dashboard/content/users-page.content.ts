import { SearchInputMorpher } from "src/app/util/seach-input.morpher";
import { DashboardPagination } from "../pagination/dashboard-pagination";

export class UsersPageContent {

  maxPerPage: number;
  skip: number;
  total: number;
  searching: boolean;

  userId: number | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  userRole: number | undefined;
  
  private constructor(
    maxPerPage: number,
    skip: number,
    total: number,
    searching: boolean,
    userId: number | undefined,
    userName: string | undefined,
    userEmail: string | undefined,
    userRole: number | undefined,
  ) {
    this.maxPerPage = maxPerPage;
    this.skip = skip;
    this.total = total;
    this.searching = searching;
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.userRole = userRole;
  }
  
  public static fromQueryParams(queryParams: any): UsersPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const userId: number | undefined = SearchInputMorpher.morphID(queryParams.userId);
    const userName: string | undefined = SearchInputMorpher.morphString(queryParams.userName);
    const userEmail: string | undefined = SearchInputMorpher.morphString(queryParams.userEmail);
    const userRole: number | undefined = SearchInputMorpher.morphRole(queryParams.userRole);

    return new UsersPageContent(
      maxPerPage,
      skip,
      total,
      searching,
      userId,
      userName,
      userEmail,
      userRole,
    );
  }

  public static fromSearch(queryParams: any): UsersPageContent {
    const maxPerPage: number = SearchInputMorpher.morphNumber(queryParams.maxPerPage) ?? DashboardPagination.MAX_PER_PAGE;
    const skip: number = SearchInputMorpher.morphNumber(queryParams.skip) ?? DashboardPagination.DEFAULT_SKIP;
    const total: number = 0;
    const searching: boolean = SearchInputMorpher.morphBoolean(queryParams.searching);
    const userId: number | undefined = SearchInputMorpher.morphID(queryParams.userId);
    const userName: string | undefined = SearchInputMorpher.morphString(queryParams.userName);
    const userEmail: string | undefined = SearchInputMorpher.morphString(queryParams.userEmail);
    const userRole: number | undefined = SearchInputMorpher.morphRole(queryParams.userRole);

    return new UsersPageContent(
      maxPerPage,
      skip,
      total,
      searching,
      userId,
      userName,
      userEmail,
      userRole,
    );
  }

}