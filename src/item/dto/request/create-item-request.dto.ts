import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { ItemEntity } from "src/item/entity/item.entity";

export class CreateItemRequestDTO {

  @ApiHideProperty()
  id: number;

  @IsString({message: HttpOperationErrorCodes.INVALID_ITEM_NAME})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_ITEM_NAME})
  @MaxLength(100, {message: HttpOperationErrorCodes.INVALID_ITEM_NAME})
  @ApiProperty({example: 'Projetor'})
  name: string;


  @IsString({message: HttpOperationErrorCodes.INVALID_ITEM_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_ITEM_DESCRIPTION})
  @MaxLength(500, {message: HttpOperationErrorCodes.INVALID_ITEM_DESCRIPTION})
  @ApiProperty({example: 'Projetor da sala A10'})
  description: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_ITEM_STATUS})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_ITEM_STATUS})
  @MaxLength(50, {message: HttpOperationErrorCodes.INVALID_ITEM_STATUS})
  @ApiProperty({example: 'Ativo'})
  status: string;

  @IsString({message: HttpOperationErrorCodes.INVALID_ITEM_LOCATION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_ITEM_LOCATION})
  @MaxLength(50, {message: HttpOperationErrorCodes.INVALID_ITEM_LOCATION})
  @ApiProperty({example: 1})
  locationId: number;

  public static fromDashboard(payload: any): CreateItemRequestDTO {
    const createItemRequestDTO: CreateItemRequestDTO = new CreateItemRequestDTO();

    createItemRequestDTO.id = Number(payload['id']) ?? 0;
    createItemRequestDTO.name = payload['name'] ?? '';
    createItemRequestDTO.description = payload['description'] ?? '';
    createItemRequestDTO.status = payload['status'] ?? '';
    createItemRequestDTO.locationId = Number(payload['locationId']) ?? 0;

    return createItemRequestDTO;
  }

  public static fromEntity(item: ItemEntity): CreateItemRequestDTO {
    const createItemRequestDTO: CreateItemRequestDTO = new CreateItemRequestDTO();

    createItemRequestDTO.id = item.id;
    createItemRequestDTO.name = item.name;
    createItemRequestDTO.description = item.description;
    createItemRequestDTO.status = item.status;
    createItemRequestDTO.locationId = item.locationId;

    return createItemRequestDTO;

  }

}