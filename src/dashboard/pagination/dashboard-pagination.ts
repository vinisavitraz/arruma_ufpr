import { QueryStringBuilder } from "src/app/util/query-string.builder";
import { PageInfo } from "./page-info";

export class DashboardPagination {

  static MIN_PER_PAGE = 1;
  static MAX_PER_PAGE = 10;
  static DEFAULT_SKIP = 0;

  pages: PageInfo[];
  activePage: PageInfo;
  previousPage: PageInfo | null;
  nextPage: PageInfo | null;
  total: number;

  constructor(
    pages: PageInfo[],
    activePage: PageInfo,
    previousPage: PageInfo | null,
    nextPage: PageInfo | null,
    total: number,
  ) {
    this.pages = pages;
    this.activePage = activePage;
    this.previousPage = previousPage;
    this.nextPage = nextPage;
    this.total = total;
  }

  public static build(
    content: any,
    uri: string,
  ): DashboardPagination {
    if (content.maxPerPage >= content.total) {
      const page: PageInfo = new PageInfo(1, QueryStringBuilder.build(content, content.maxPerPage, uri), 'active');

      return new DashboardPagination(
        [page],
        page,
        null,
        null,
        content.total,
      );
    }

    let numberOfPages: number = content.total / content.maxPerPage;
    const rest: number = content.total % content.maxPerPage;
    
    if (rest > 0) {
      numberOfPages +=1;
    }

    const pages: PageInfo[] = [];
    let skip: number = 0;

    
    const activePageNumber: number = this.getActivePage(content.skip, content.maxPerPage);
    const previousPageNumber: number = activePageNumber - 1;
    const nextPageNumber: number = activePageNumber + 1;
    let activePage: PageInfo | null = null;
    let previousPage: PageInfo | null = null;
    let nextPage: PageInfo | null = null;

    for (let i = 1; i <= numberOfPages; i++) {
      const isActivePage: boolean = i === activePageNumber;
      const isPreviousPage: boolean = i === previousPageNumber;
      const isNextPage: boolean = i === nextPageNumber;
      const active: string = isActivePage ? 'active' : '';

      const page: PageInfo = new PageInfo(i, QueryStringBuilder.build(content, content.maxPerPage, uri, skip,), active);

      if (isActivePage) {
        activePage = page;
      }
      if (isPreviousPage) {
        previousPage = page;
      }
      if (isNextPage) {
        nextPage = page;
      }

      pages.push(page);
      skip += content.maxPerPage;
    }

    return new DashboardPagination(
      pages,
      activePage,
      previousPage,
      nextPage,  
      content.total,
    );
  }

  private static getActivePage(skip: number, maxPerPage: number): number {
    return (skip / maxPerPage) + 1;
  }
}