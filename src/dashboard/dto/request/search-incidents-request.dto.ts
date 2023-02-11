import { SearchInputMorpher } from "src/app/util/seach-input.morpher";
import { UserEntity } from "src/user/entity/user.entity";

export class SearchIncidentsRequestDTO {

  incidentId: number | undefined;
  incidentTitle: string | undefined;
  incidentOpenDate: Date | undefined;
  incidentEndDate: Date | undefined;
  incidentUserName: string | undefined;
  incidentUserEmail: string | undefined;
  incidentTypeId: number | undefined;
  locationId: number | undefined;
  itemId: number | undefined;
  incidentStatus: string;
  origin: string;
  skip: number | null;
  limit: number | null;

  public static fromDashboard(payload: any, user: UserEntity): SearchIncidentsRequestDTO {
    const searchIncidentsRequestDTO: SearchIncidentsRequestDTO = new SearchIncidentsRequestDTO();

    const incidentId: number = SearchInputMorpher.morphNumber(payload['incidentId']);
    searchIncidentsRequestDTO.incidentId = incidentId > 0 ? incidentId : undefined;
    searchIncidentsRequestDTO.incidentTitle = SearchInputMorpher.morphString(payload['incidentTitle']);
    searchIncidentsRequestDTO.incidentOpenDate = SearchInputMorpher.morphDateString(payload['incidentOpenDate']);
    searchIncidentsRequestDTO.incidentEndDate = SearchInputMorpher.morphDateString(payload['incidentEndDate']);
    searchIncidentsRequestDTO.incidentUserName = SearchInputMorpher.morphString(payload['incidentUserName']);
    searchIncidentsRequestDTO.incidentUserEmail = SearchInputMorpher.morphString(payload['incidentUserEmail']);
    searchIncidentsRequestDTO.incidentTypeId = SearchInputMorpher.morphNumber(payload['incidentTypeId']);
    searchIncidentsRequestDTO.locationId = SearchInputMorpher.morphNumber(payload['locationId']);
    searchIncidentsRequestDTO.itemId = SearchInputMorpher.morphNumber(payload['itemId']);
    searchIncidentsRequestDTO.incidentStatus = SearchInputMorpher.morphString(payload['incidentStatus']);
    searchIncidentsRequestDTO.origin = SearchInputMorpher.morphString(payload['origin']) ?? '';
    searchIncidentsRequestDTO.skip = SearchInputMorpher.morphNumber(payload['skip']);
    searchIncidentsRequestDTO.limit = SearchInputMorpher.morphNumber(payload['limit']);

    return searchIncidentsRequestDTO;
  }

  public static fromEmptySearch(incidentStatus: string, origin: string): SearchIncidentsRequestDTO {
    const searchIncidentsRequestDTO: SearchIncidentsRequestDTO = new SearchIncidentsRequestDTO();

    searchIncidentsRequestDTO.incidentStatus = incidentStatus;
    searchIncidentsRequestDTO.origin = origin;

    return searchIncidentsRequestDTO;

  }

}