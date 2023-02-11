import { PageInfo } from "./page-info";

export class Pages {

  readonly pages: PageInfo[];

  constructor(pages: PageInfo[]) {
    this.pages = pages;
  }

}