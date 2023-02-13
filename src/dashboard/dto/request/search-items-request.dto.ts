import { ItemsPageContent } from "src/dashboard/content/items-page.content";

export class SearchItemsRequestDTO {

  itemId: number | undefined;
  itemName: string | undefined;
  itemDescription: string | undefined;
  locationId: number | undefined;
  skip: number | null;
  maxPerPage: number | null;

  public static fromPageContent(itemsPageContent: ItemsPageContent): SearchItemsRequestDTO {
    const searchItemsRequestDTO: SearchItemsRequestDTO = new SearchItemsRequestDTO();

    searchItemsRequestDTO.itemId = itemsPageContent.itemId;
    searchItemsRequestDTO.itemName = itemsPageContent.itemName;
    searchItemsRequestDTO.itemDescription = itemsPageContent.itemDescription;
    searchItemsRequestDTO.locationId = itemsPageContent.locationId;
    searchItemsRequestDTO.skip = itemsPageContent.skip;
    searchItemsRequestDTO.maxPerPage = itemsPageContent.maxPerPage;

    return searchItemsRequestDTO;

  }

}