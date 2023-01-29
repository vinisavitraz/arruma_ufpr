import { user } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

export class UserRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async findUserByEmail(email: string): Promise<user | null> {
    return await this.connection.user.findUnique({ where: { email: email } });
  }

  public async findUserByID(id: number): Promise<user | null> {
    return await this.connection.user.findUnique({ where: { id: id } })
  }
  
}