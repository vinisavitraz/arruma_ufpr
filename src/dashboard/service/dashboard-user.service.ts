import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateLocationRequestDTO } from 'src/location/dto/request/create-location-request.dto';
import { UpdateLocationRequestDTO } from 'src/location/dto/request/update-location-request.dto';
import { LocationEntity } from 'src/location/entity/location.entity';
import { LocationService } from 'src/location/location.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DashboardUserService {

  constructor(private readonly userService: UserService) {}

  public async findUsers(): Promise<UserEntity[]> {
    return await this.userService.findUsers();
  }

  // public async findLocationByIDOrCry(id: number): Promise<LocationEntity> {
  //   return await this.locationService.findLocationByIDOrCry(id);
  // }

  // public async createLocation(createLocationRequestDto: CreateLocationRequestDTO): Promise<void> {
  //   await validateOrReject(createLocationRequestDto);

  //   await this.locationService.createLocation(createLocationRequestDto); 
  // }

  // public async updateLocation(updateLocationRequestDTO: UpdateLocationRequestDTO): Promise<void> {
  //   await validateOrReject(updateLocationRequestDTO);

  //   await this.locationService.updateLocation(updateLocationRequestDTO); 
  // }

  // public async deleteLocation(locationId: number): Promise<void> {
  //   await this.locationService.deleteLocation(locationId); 
  // }

}
