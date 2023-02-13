import { LocationsPageContent } from "src/dashboard/content/locations-page.content";

export class SearchLocationsRequestDTO {

  locationId: number | undefined;
  locationName: string | undefined;
  locationDescription: string | undefined;
  skip: number | null;
  maxPerPage: number | null;

  public static fromPageContent(locationsPageContent: LocationsPageContent): SearchLocationsRequestDTO {
    const searchLocationsRequestDTO: SearchLocationsRequestDTO = new SearchLocationsRequestDTO();

    searchLocationsRequestDTO.locationId = locationsPageContent.locationId;
    searchLocationsRequestDTO.locationName = locationsPageContent.locationName;
    searchLocationsRequestDTO.locationDescription = locationsPageContent.locationDescription;
    searchLocationsRequestDTO.skip = locationsPageContent.skip;
    searchLocationsRequestDTO.maxPerPage = locationsPageContent.maxPerPage;

    return searchLocationsRequestDTO;

  }

}