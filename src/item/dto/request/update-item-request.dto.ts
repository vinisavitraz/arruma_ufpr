import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { ItemEntity } from "src/item/entity/item.entity";

export class UpdateItemRequestDTO {

  @IsInt({message: HttpOperationErrorCodes.INVALID_ITEM_ID})
  @ApiProperty({example: 1})
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

  @IsInt({message: HttpOperationErrorCodes.INVALID_ITEM_LOCATION})
  @ApiProperty({example: 1})
  locationId: number;

  public static fromDashboard(payload: any): UpdateItemRequestDTO {
    const updateItemRequestDTO: UpdateItemRequestDTO = new UpdateItemRequestDTO();

    updateItemRequestDTO.id = Number(payload['id']) ?? 0;
    updateItemRequestDTO.name = payload['name'] ?? '';
    updateItemRequestDTO.description = payload['description'] ?? '';
    updateItemRequestDTO.locationId = Number(payload['locationId']) ?? 0;

    return updateItemRequestDTO;
  }

  public static fromEntity(item: ItemEntity): UpdateItemRequestDTO {
    const updateItemRequestDTO: UpdateItemRequestDTO = new UpdateItemRequestDTO();

    updateItemRequestDTO.id = item.id;
    updateItemRequestDTO.name = item.name;
    updateItemRequestDTO.description = item.description;
    updateItemRequestDTO.locationId = item.locationId;

    return updateItemRequestDTO;

  }

}