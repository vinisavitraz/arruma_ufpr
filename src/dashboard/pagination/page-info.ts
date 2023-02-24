export class PageInfo {

  readonly pageNumber: number;
  readonly pageUrl: string;
  readonly active: string;

  constructor(pageNumber: number, pageUrl: string, active: string) {
    this.pageNumber = pageNumber;
    this.pageUrl = pageUrl;
    this.active = active;
  }

}