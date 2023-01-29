import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateLocationRequestDTO } from 'src/location/dto/request/create-location-request.dto';
import { LocationEntity } from 'src/location/entity/location.entity';
import { LocationService } from 'src/location/location.service';

@Injectable()
export class DashboardLocationService {

  constructor(private readonly locationService: LocationService) {}

  public async findLocations(): Promise<LocationEntity[]> {
    return await this.locationService.findLocations();
  }

  public async findLocationByIDOrCry(id: number): Promise<LocationEntity> {
    return await this.locationService.findLocationByIDOrCry(id);
  }

  public async createLocation(createLocationRequestDto: CreateLocationRequestDTO): Promise<void> {
    await validateOrReject(createLocationRequestDto);

    await this.locationService.createLocation(createLocationRequestDto); 
  }

}
