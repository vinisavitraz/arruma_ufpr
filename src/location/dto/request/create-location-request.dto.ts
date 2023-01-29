import { IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { LocationEntity } from "src/location/entity/location.entity";

export class CreateLocationRequestDTO {

  id: number = 0;

  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_LOCATION_NAME})
  name: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  @MaxLength(500, {message: HttpOperationErrorCodes.INVALID_LOCATION_DESCRIPTION})
  description: string;

  public static fromDashboard(payload: any): CreateLocationRequestDTO {
    const createLocationRequestDto: CreateLocationRequestDTO = new CreateLocationRequestDTO();

    createLocationRequestDto.id = Number(payload['id']) ?? 0;
    createLocationRequestDto.name = payload['name'] ?? '';
    createLocationRequestDto.description = payload['description'] ?? '';

    return createLocationRequestDto;
  }

  public static fromEntity(location: LocationEntity): CreateLocationRequestDTO {
    const createLocationRequestDto: CreateLocationRequestDTO = new CreateLocationRequestDTO();

    createLocationRequestDto.id = location.id;
    createLocationRequestDto.name = location.name;
    createLocationRequestDto.description = location.description;

    return createLocationRequestDto;

  }

}