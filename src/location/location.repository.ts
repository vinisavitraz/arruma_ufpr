import { location } from "@prisma/client";
import { SearchLocationsRequestDTO } from "src/dashboard/dto/request/search-locations-request.dto";
import { DatabaseService } from "src/database/database.service";
import { CreateLocationRequestDTO } from "./dto/request/create-location-request.dto";
import { UpdateLocationRequestDTO } from "./dto/request/update-location-request.dto";
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

  public async searchLocations(searchLocationsRequestDTO: SearchLocationsRequestDTO): Promise<location[]> {
    return await this.connection.location.findMany({
      skip: searchLocationsRequestDTO.skip,
      take: searchLocationsRequestDTO.maxPerPage,
      where: {
        id: searchLocationsRequestDTO.locationId,
        name: {
          contains: searchLocationsRequestDTO.locationName,
          mode: 'insensitive',
        },
        description: {
          contains: searchLocationsRequestDTO.locationDescription,
          mode: 'insensitive',
        },
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });
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

  public async updateLocation(updateLocationRequestDTO: UpdateLocationRequestDTO): Promise<location | null> {
    return await this.connection.location.update({ 
      where: { id: updateLocationRequestDTO.id },
      data: {
        name: updateLocationRequestDTO.name,
        description: updateLocationRequestDTO.description,
      },
    });
  }

  public async deleteLocation(location: LocationEntity): Promise<void> {
    await this.connection.location.delete({where: { id: location.id }});
  }

  public async findTotalLocations(): Promise<number> {
    return await this.connection.location.count();
  }
  
}