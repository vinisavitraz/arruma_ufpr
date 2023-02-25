import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";

export class UpdateIncidentRequestDTO {

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_ID})
  @ApiProperty({example: 1})
  incidentId: number;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE})
  @ApiProperty({example: 1})
  incidentTypeId: number;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_LOCATION})
  @ApiProperty({example: 1})
  locationId: number;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_ITEM})
  @ApiProperty({example: 1})
  itemId: number;

  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @ApiProperty({example: 'Projetor quebrou'})
  title: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @MaxLength(1000, {message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @ApiProperty({example: 'Projetor quebrou e necessita de manutencao'})
  description: string;

  public static fromDashboard(payload: any): UpdateIncidentRequestDTO {
    const updateIncidentRequestDTO: UpdateIncidentRequestDTO = new UpdateIncidentRequestDTO();

    updateIncidentRequestDTO.incidentId = payload['incidentId'] ? Number(payload['incidentId']) : undefined;
    updateIncidentRequestDTO.incidentTypeId = payload['incidentTypeId'] ? Number(payload['incidentTypeId']) : undefined;
    updateIncidentRequestDTO.locationId = payload['locationId'] ? Number(payload['locationId']) : undefined;
    updateIncidentRequestDTO.itemId = payload['itemId'] ? Number(payload['itemId']) : undefined;
    updateIncidentRequestDTO.title = payload['title'] ? payload['title'] : undefined;
    updateIncidentRequestDTO.description = payload['description'] ? payload['description'] : undefined;
    
    return updateIncidentRequestDTO;
  }

}