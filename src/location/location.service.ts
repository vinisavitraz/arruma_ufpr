import { HttpStatus, Injectable } from '@nestjs/common';
import { location } from '@prisma/client';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { CreateLocationRequestDTO } from './dto/request/create-location-request.dto';
import { UpdateLocationRequestDTO } from './dto/request/update-location-request.dto';
import { LocationEntity } from './entity/location.entity';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {

  private repository: LocationRepository;

  constructor(private databaseService: DatabaseService) {
      this.repository = new LocationRepository(this.databaseService);
  }

  public async findLocations(): Promise<LocationEntity[]> {
    const locationsDb: location[] = await this.repository.findLocations();

    return locationsDb.map((location: location) => {
      return LocationEntity.fromRepository(location);
    });
  }

  public async findLocationByIDOrCry(id: number): Promise<LocationEntity> {
    const locationDb: location | null = await this.repository.findLocationByID(id);

    if (!locationDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'Location with ID ' + id + ' not found on database.', 
        HttpOperationErrorCodes.LOCATION_NOT_FOUND,
      );
    }

    return LocationEntity.fromRepository(locationDb);
  }

  public async createLocation(createLocationRequestDTO: CreateLocationRequestDTO): Promise<LocationEntity> {
    const locationDb: location = await this.repository.createLocation(createLocationRequestDTO);

    return LocationEntity.fromRepository(locationDb);
  }

  public async updateLocation(updateLocationRequestDTO: UpdateLocationRequestDTO): Promise<LocationEntity> {
    await this.findLocationByIDOrCry(updateLocationRequestDTO.id);
    
    const locationDb: location = await this.repository.updateLocation(updateLocationRequestDTO);

    return LocationEntity.fromRepository(locationDb);
  }

  public async deleteLocation(locationId: number): Promise<void> {
    const location: LocationEntity = await this.findLocationByIDOrCry(locationId);

    await this.repository.deleteLocation(location);
  }

}
