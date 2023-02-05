import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { HttpOperationErrorCodes } from "src/app/exception/http-operation-error-codes";
import { IncidentInteractionEntity } from "src/incident/entity/incident-interaction.entity";
import { UserEntity } from "src/user/entity/user.entity";

export class CreateIncidentInteractionRequestDTO {

  @IsString({message: HttpOperationErrorCodes.INVALID_INCIDENT_INTERACTION_DESCRIPTION})
  @MinLength(1, {message: HttpOperationErrorCodes.INVALID_INCIDENT_INTERACTION_DESCRIPTION})
  @MaxLength(1000, {message: HttpOperationErrorCodes.INVALID_INCIDENT_INTERACTION_DESCRIPTION})
  @ApiProperty({example: 'Item precisa de manutenção'})
  description: string;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_INTERACTION_INCIDENT})
  @ApiProperty({example: 1})
  incidentId: number;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_INTERACTION_USER})
  @ApiProperty({example: 1})
  userId: number;

  @IsInt({message: HttpOperationErrorCodes.INVALID_INCIDENT_INTERACTION_ORIGIN})
  @ApiProperty({example: 1})
  origin: number;

  public static fromDashboard(payload: any, user: UserEntity): CreateIncidentInteractionRequestDTO {
    const createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO = new CreateIncidentInteractionRequestDTO();

    createIncidentInteractionRequestDTO.description = payload['description'] ?? '';
    createIncidentInteractionRequestDTO.incidentId = Number(payload['incidentId']) ?? 0;
    createIncidentInteractionRequestDTO.userId = user.id;
    createIncidentInteractionRequestDTO.origin = user.role;

    return createIncidentInteractionRequestDTO;
  }

  public static fromEntity(incidentInteraction: IncidentInteractionEntity): CreateIncidentInteractionRequestDTO {
    const createIncidentInteractionRequestDTO: CreateIncidentInteractionRequestDTO = new CreateIncidentInteractionRequestDTO();

    createIncidentInteractionRequestDTO.description = incidentInteraction.description;
    createIncidentInteractionRequestDTO.incidentId = incidentInteraction.incidentId;
    createIncidentInteractionRequestDTO.userId = incidentInteraction.userId;
    createIncidentInteractionRequestDTO.origin = incidentInteraction.origin;

    return createIncidentInteractionRequestDTO;

  }

}