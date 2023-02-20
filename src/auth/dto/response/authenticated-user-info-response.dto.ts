import { ApiProperty } from "@nestjs/swagger";
import { user } from "@prisma/client";
import { UserEntity } from "src/user/entity/user.entity";

export class AuthenticatedUserInfoResponseDTO {

  @ApiProperty({ type: UserEntity })
  readonly authenticatedUserInfo: UserEntity;

  constructor(authenticatedUserInfo: UserEntity) {
    this.authenticatedUserInfo = authenticatedUserInfo;
  }

  public static fromEntity(user: user): AuthenticatedUserInfoResponseDTO {
    return new AuthenticatedUserInfoResponseDTO(UserEntity.fromRepository(user));
  }

}