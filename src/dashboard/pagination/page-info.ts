export class PageInfo {

  readonly pageNumber: number;
  readonly pageUrl: string;

  constructor(pageNumber: number, pageUrl: string) {
    this.pageNumber = pageNumber;
    this.pageUrl = pageUrl;
  }

}