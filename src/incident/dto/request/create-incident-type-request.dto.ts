import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { IncidentTypeEntity } from "src/incident/entity/incident-type.entity";

export class CreateIncidentTypeRequestDTO {

  @ApiHideProperty()
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

  public static fromDashboard(payload: any): CreateIncidentTypeRequestDTO {
    const createIncidentTypeRequestDto: CreateIncidentTypeRequestDTO = new CreateIncidentTypeRequestDTO();

    createIncidentTypeRequestDto.id = Number(payload['id']) ?? 0;
    createIncidentTypeRequestDto.name = payload['name'] ?? '';
    createIncidentTypeRequestDto.description = payload['description'] ?? '';

    return createIncidentTypeRequestDto;
  }

  public static fromEntity(incidentType: IncidentTypeEntity): CreateIncidentTypeRequestDTO {
    const createIncidentTypeRequestDto: CreateIncidentTypeRequestDTO = new CreateIncidentTypeRequestDTO();

    createIncidentTypeRequestDto.id = incidentType.id;
    createIncidentTypeRequestDto.name = incidentType.name;
    createIncidentTypeRequestDto.description = incidentType.description;

    return createIncidentTypeRequestDto;

  }

}