import { location } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { CreateLocationRequestDTO } from "./dto/request/create-location-request.dto";

export class LocationRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async findLocations(): Promise<location[]> {
    return await this.connection.location.findMany({});
  }

  public async findLocationByID(id: number): Promise<location | null> {
    return await this.connection.location.findUnique({ where: { id: id } });
  }

  public async createLocation(createLocationRequestDTO: CreateLocationRequestDTO): Promise<location | null> {
    return await this.connection.location.create({ 
      data: {
        name: createLocationRequestDTO.name,
        description: createLocationRequestDTO.description,
      },
     });
  }
  
}