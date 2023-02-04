import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { IncidentEntity } from "src/incident/entity/incident.entity";
import { UserEntity } from "src/user/entity/user.entity";

export class CreateIncidentRequestDTO {

  @ApiHideProperty()
  id: number;

  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_INCIDENT_TITLE})
  @ApiProperty({example: 'Manutenção'})
  title: string;


  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @MaxLength(500, {message: HttpOperationErrorCodes.INVALID_INCIDENT_DESCRIPTION})
  @ApiProperty({example: 'Item precisa de manutenção'})
  description: string;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_USER})
  @ApiProperty({example: 1})
  userId: number;
  
  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE})
  @ApiProperty({example: 1})
  incidentTypeId: number;

  @IsOptional()
  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_NAME})
  @ApiPropertyOptional({example: ''})
  incidentTypeName: string;

  @IsOptional()
  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_DESCRIPTION})
  @ApiPropertyOptional({example: ''})
  incidentTypeDescription: string;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_LOCATION})
  @ApiProperty({example: 0})
  locationId: number;

  @IsOptional()
  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @ApiProperty({example: 'SEPT'})
  locationName: string;

  @IsOptional()
  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @ApiProperty({ example: 'Setor de educação professional e tecnologica da UFPR' })
  locationDescription: string;

  @IsOptional()
  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_ITEM})
  @ApiProperty({example: 0})
  itemId: number;

  @IsOptional()
  @IsString({message: HttpOperationErrorCodes.INVALID_ITEM_NAME})
  @ApiProperty({example: 'Projetor'})
  itemName: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_ITEM_DESCRIPTION})
  @ApiProperty({example: 'Projetor da sala A10'})
  itemDescription: string;

  public static fromDashboard(payload: any, user: UserEntity): CreateIncidentRequestDTO {
    const createIncidentRequestDTO: CreateIncidentRequestDTO = new CreateIncidentRequestDTO();

    createIncidentRequestDTO.id = payload['id'] ? Number(payload['id']) : 0;
    createIncidentRequestDTO.title = payload['title'] ?? '';
    createIncidentRequestDTO.description = payload['description'] ?? '';
    createIncidentRequestDTO.userId = user.id;
    createIncidentRequestDTO.incidentTypeId = payload['incidentTypeId'] ? Number(payload['incidentTypeId']) : 0;
    createIncidentRequestDTO.incidentTypeName = payload['incidentTypeName'] ?? '';
    createIncidentRequestDTO.incidentTypeDescription = payload['incidentTypeDescription'] ?? '';
    createIncidentRequestDTO.locationId = payload['locationId'] ? Number(payload['locationId']) : 0;
    createIncidentRequestDTO.locationName = payload['locationName'] ?? '';
    createIncidentRequestDTO.locationDescription = payload['locationDescription'] ?? '';
    createIncidentRequestDTO.itemId = payload['itemId'] ? Number(payload['itemId']) : 0;
    createIncidentRequestDTO.itemName = payload['itemName'] ?? '';
    createIncidentRequestDTO.itemDescription = payload['itemDescription'] ?? '';

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