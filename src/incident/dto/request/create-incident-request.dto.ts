import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { DateFormatter } from "src/app/util/date.formatter";
import { IncidentEntity } from "src/incident/entity/incident.entity";

export class CreateIncidentRequestDTO {

  @ApiHideProperty()
  id: number;

  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @ApiProperty({example: 'Projetor danificado'})
  title: string;


  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @MaxLength(500, {message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @ApiProperty({example: 'Projetor apresenta mau contato em seu funcionamento'})
  description: string;
  
  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE})
  @ApiProperty({example: 1})
  incidentTypeId: number;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_LOCATION})
  @ApiProperty({example: 1})
  locationId: number;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_ITEM})
  @ApiProperty({example: 1})
  itemId: number;

  public static fromDashboard(payload: any): CreateIncidentRequestDTO {
    const createIncidentRequestDTO: CreateIncidentRequestDTO = new CreateIncidentRequestDTO();

    createIncidentRequestDTO.id = payload['id'] ? Number(payload['id']) : 0;
    createIncidentRequestDTO.title = payload['title'] ?? '';
    createIncidentRequestDTO.description = payload['description'] ?? '';
    createIncidentRequestDTO.incidentTypeId = payload['incidentTypeId'] ? Number(payload['incidentTypeId']) : 0;
    createIncidentRequestDTO.locationId = payload['locationId'] ? Number(payload['locationId']) : 0;
    createIncidentRequestDTO.itemId = payload['itemId'] ? Number(payload['itemId']) : 0;

    return createIncidentRequestDTO;
  }

  public static fromEntity(incident: IncidentEntity): CreateIncidentRequestDTO {
    const createIncidentRequestDTO: CreateIncidentRequestDTO = new CreateIncidentRequestDTO();

    createIncidentRequestDTO.id = incident.id;
    createIncidentRequestDTO.title = incident.title;
    createIncidentRequestDTO.description = incident.description;
    createIncidentRequestDTO.incidentTypeId = incident.incidentTypeId;
    createIncidentRequestDTO.locationId = incident.locationId;
    createIncidentRequestDTO.itemId = incident.itemId;

    return createIncidentRequestDTO;

  }

}