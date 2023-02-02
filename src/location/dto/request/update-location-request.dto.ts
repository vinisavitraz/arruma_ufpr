import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { LocationEntity } from "src/location/entity/location.entity";

export class UpdateLocationRequestDTO {

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_TYPE_ID})
  @ApiProperty({example: 1})
  id: number;

  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @ApiProperty({example: 'SEPT'})
  name: string;


  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @MaxLength(500, {message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @ApiProperty({example: 'Setor de educação professional e tecnologica da UFPR'})
  description: string;

  public static fromDashboard(payload: any): UpdateLocationRequestDTO {
    const updateLocationRequestDTO: UpdateLocationRequestDTO = new UpdateLocationRequestDTO();

    updateLocationRequestDTO.id = Number(payload['id']) ?? 0;
    updateLocationRequestDTO.name = payload['name'] ?? '';
    updateLocationRequestDTO.description = payload['description'] ?? '';

    return updateLocationRequestDTO;
  }

  public static fromEntity(location: LocationEntity): UpdateLocationRequestDTO {
    const updateLocationRequestDTO: UpdateLocationRequestDTO = new UpdateLocationRequestDTO();

    updateLocationRequestDTO.id = location.id;
    updateLocationRequestDTO.name = location.name;
    updateLocationRequestDTO.description = location.description;

    return updateLocationRequestDTO;

  }

}