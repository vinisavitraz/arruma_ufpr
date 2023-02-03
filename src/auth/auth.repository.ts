import { user_token } from "@prisma/client";
import { TokenType } from "src/app/enum/token.enum";
import { DatabaseService } from "src/database/database.service";
import { TokenEntity } from "./entity/token.entity";

export class AuthRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
      this.connection = databaseService;
  }

  public async saveToken(token: TokenEntity): Promise<user_token> {
    return await this.connection.user_token.create({
      data: {
        type: token.type,
        token_number: token.number,
        create_date: token.createDate,
        expiration_date: token.expirationDate,
        user_id: token.userId,
      },
    });
  }

  public async updateTokenExpirationDate(tokenId: number, expirationDate: Date): Promise<user_token | null> {
    return await this.connection.user_token.update({
      where: {
        id: tokenId
      },
      data: {
        expiration_date: expirationDate,
      },
    });
  }

  public async findTokenByType(userId: number, type: TokenType): Promise<user_token | null> {
    return await this.connection.user_token.findFirst({ 
      where: {
        user_id: userId,
        type: type,
        expiration_date: {gte: new Date()}
      },
    });
  }

}