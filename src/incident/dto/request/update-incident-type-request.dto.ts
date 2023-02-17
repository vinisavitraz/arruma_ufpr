import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";

export class UpdateIncidentTypeRequestDTO {

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_ID})
  @ApiProperty({example: 1})
  id: number;

  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_NAME})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_NAME})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_NAME})
  @ApiProperty({example: 'Manutenção'})
  name: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_DESCRIPTION})
  @MaxLength(500, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_DESCRIPTION})
  @ApiProperty({example: 'Item precisa de manutenção'})
  description: string;

  public static fromDashboard(payload: any): UpdateIncidentTypeRequestDTO {
    const updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO = new UpdateIncidentTypeRequestDTO();

    updateIncidentTypeRequestDTO.id = Number(payload['id']) ?? 0;
    updateIncidentTypeRequestDTO.name = payload['name'] ?? '';
    updateIncidentTypeRequestDTO.description = payload['description'] ?? '';

    return updateIncidentTypeRequestDTO;
  }

  public static fromEntity(incidentType: IncidentTypeEntity): UpdateIncidentTypeRequestDTO {
    const updateIncidentTypeRequestDTO: UpdateIncidentTypeRequestDTO = new UpdateIncidentTypeRequestDTO();

    updateIncidentTypeRequestDTO.id = incidentType.id;
    updateIncidentTypeRequestDTO.name = incidentType.name;
    updateIncidentTypeRequestDTO.description = incidentType.description;

    return updateIncidentTypeRequestDTO;

  }

}