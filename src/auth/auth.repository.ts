import { DatabaseService } from "src/database/database.service";

export class AuthRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
      this.connection = databaseService;
  }

}