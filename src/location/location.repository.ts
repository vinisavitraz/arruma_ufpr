import { location } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { CreateLocationRequestDTO } from "./dto/request/create-location-request.dto";
import { LocationEntity } from "./entity/location.entity";

export class LocationRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async findLocations(): Promise<location[]> {
    return await this.connection.location.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  public async findLocationByID(id: number): Promise<location | null> {
    return await this.connection.location.findUnique({ where: { id: id } });
  }

  public async createLocation(createLocationRequestDTO: CreateLocationRequestDTO): Promise<location | null> {
    return await this.connection.location.upsert({ 
      where: { id: createLocationRequestDTO.id },
      update: {
        name: createLocationRequestDTO.name,
        description: createLocationRequestDTO.description,
      },
      create: {
        name: createLocationRequestDTO.name,
        description: createLocationRequestDTO.description,
      },
    });
  }

  public async deleteLocation(location: LocationEntity): Promise<void> {
    await this.connection.location.delete({where: { id: location.id }});
  }
  
}