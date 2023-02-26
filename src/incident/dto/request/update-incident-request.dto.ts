import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";

export class UpdateIncidentRequestDTO {

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_ID})
  @ApiProperty({example: 1})
  id: number;
  
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
  @ApiProperty({example: 1})
  locationId: number;

  @IsOptional()
  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @ApiProperty({example: 'SEPT'})
  locationName: string;

  @IsOptional()
  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @ApiProperty({ example: 'Setor de educação professional e tecnologica da UFPR' })
  locationDescription: string;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_ITEM})
  @ApiProperty({example: 1})
  itemId: number;

  @IsOptional()
  @IsString({message: HttpOperationErrorCodes.INVALID_ITEM_NAME})
  @ApiProperty({example: 'Projetor'})
  itemName: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_ITEM_DESCRIPTION})
  @ApiProperty({example: 'Projetor da sala A10'})
  itemDescription: string;
  
  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_PRIORITY})
  @ApiProperty({example: 0})
  priority: number;

  public static fromDashboard(payload: any): UpdateIncidentRequestDTO {
    const updateIncidentRequestDTO: UpdateIncidentRequestDTO = new UpdateIncidentRequestDTO();

    updateIncidentRequestDTO.id = payload['id'] ? Number(payload['id']) : undefined;
    updateIncidentRequestDTO.title = payload['title'] ? payload['title'] : undefined;
    updateIncidentRequestDTO.description = payload['description'] ? payload['description'] : undefined;
    updateIncidentRequestDTO.priority = payload['priority'] ? Number(payload['priority']) : undefined;
    updateIncidentRequestDTO.incidentTypeId = payload['incidentTypeId'] ? Number(payload['incidentTypeId']) : undefined;
    updateIncidentRequestDTO.incidentTypeName = payload['incidentTypeName'] ?? '';
    updateIncidentRequestDTO.incidentTypeDescription = payload['incidentTypeDescription'] ?? '';
    updateIncidentRequestDTO.locationId = payload['locationId'] ? Number(payload['locationId']) : undefined;
    updateIncidentRequestDTO.locationName = payload['locationName'] ?? '';
    updateIncidentRequestDTO.locationDescription = payload['locationDescription'] ?? '';
    updateIncidentRequestDTO.itemId = payload['itemId'] ? Number(payload['itemId']) : undefined;
    updateIncidentRequestDTO.itemName = payload['itemName'] ?? '';
    updateIncidentRequestDTO.itemDescription = payload['itemDescription'] ?? '';
    
    
    return updateIncidentRequestDTO;
  }

}