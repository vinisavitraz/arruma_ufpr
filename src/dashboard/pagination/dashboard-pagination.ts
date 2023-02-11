import { QueryStringBuilder } from "src/app/util/query-string.builder";
import { PageInfo } from "./page-info";

export class DashboardPagination {

  static MIN_PER_PAGE = 1;
  static MAX_PER_PAGE = 10;
  static DEFAULT_SKIP = 0;

  private pages: PageInfo[];


  constructor(pages: PageInfo[]) {
    this.pages = pages;
  }

  public static build(
    content: any,
    uri: string,
  ): DashboardPagination {
    if (content.maxPerPage >= content.total) {
      return new DashboardPagination([new PageInfo(1, QueryStringBuilder.buildForIncidents(content, content.maxPerPage, uri))]);
    }

    let numberOfPages: number = content.total / content.maxPerPage;
    const rest: number = content.total % content.maxPerPage;
    
    if (rest > 0) {
      numberOfPages +=1;
    }

    const pages: PageInfo[] = [];
    let skip: number = 0;

    for (let i = 1; i <= numberOfPages; i++) {
      pages.push(new PageInfo(i, QueryStringBuilder.buildForIncidents(content, content.maxPerPage, uri, skip)));
      skip += content.maxPerPage;
    }

    return new DashboardPagination(pages);
  }
}