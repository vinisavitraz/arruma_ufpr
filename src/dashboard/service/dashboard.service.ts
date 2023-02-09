import { Injectable } from '@nestjs/common';
import { IncidentStatusEnum } from 'src/app/enum/status.enum';
import { IncidentService } from 'src/incident/incident.service';
import { ItemService } from 'src/item/item.service';
import { LocationService } from 'src/location/location.service';
import { UserService } from 'src/user/user.service';
import { HomePageResponseDTO } from '../dto/response/home-page-response.dto';

@Injectable()
export class DashboardService {

  constructor(
    private readonly incidentService: IncidentService,
    private readonly locationService: LocationService,
    private readonly itemService: ItemService,
    private readonly userService: UserService,
  ) {}

  public async getHomePageData(): Promise<HomePageResponseDTO> {
    const totalOpenIncidents: number = await this.incidentService.findTotalIncidentsByStatus(IncidentStatusEnum.OPEN);
    const totalPendingIncidents: number = await this.incidentService.findTotalIncidentsByStatus(IncidentStatusEnum.PENDING);
    const totalClosedIncidents: number = await this.incidentService.findTotalIncidentsByStatus(IncidentStatusEnum.CLOSED);
    const totalIncidents: number = await this.incidentService.findTotalIncidentsByStatus('');
    const totalIncidentTypes: number = await this.incidentService.findTotalIncidentTypes();
    const totalLocations: number = await this.locationService.findTotalLocations();
    const totalItems: number = await this.itemService.findTotalItems();
    const totalUsers: number = await this.userService.findTotalUsers();

    return new HomePageResponseDTO(
      totalOpenIncidents,
      totalPendingIncidents,
      totalClosedIncidents,
      totalIncidents,
      totalIncidentTypes,
      totalLocations,
      totalItems,
      totalUsers,
    );
  }

}
