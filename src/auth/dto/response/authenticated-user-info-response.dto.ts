import { ApiProperty } from "@nestjs/swagger";
import { user } from "@prisma/client";
import { AuthenticatedUserInfoEntity } from "src/auth/entity/authenticated-user-info.entity";

export class AuthenticatedUserInfoResponseDTO {

  @ApiProperty({ type: AuthenticatedUserInfoEntity })
  readonly authenticatedUserInfo: AuthenticatedUserInfoEntity;

  constructor(authenticatedUserInfo: AuthenticatedUserInfoEntity) {
    this.authenticatedUserInfo = authenticatedUserInfo;
  }

  public static fromEntity(user: user): AuthenticatedUserInfoResponseDTO {
    const authenticatedUserInfo: AuthenticatedUserInfoEntity = new AuthenticatedUserInfoEntity(
      user.id,
      user.email,
      user.name,
      user.role,
    );

    return new AuthenticatedUserInfoResponseDTO(authenticatedUserInfo);
  }

}