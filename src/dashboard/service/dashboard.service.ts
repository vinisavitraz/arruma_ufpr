import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { RoleEnum } from 'src/app/enum/role.enum';
import { IncidentStatusEnum } from 'src/app/enum/status.enum';
import { AuthService } from 'src/auth/auth.service';
import { IncidentService } from 'src/incident/incident.service';
import { ItemService } from 'src/item/item.service';
import { LocationService } from 'src/location/location.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { ForgotPasswordRequestDTO } from '../dto/request/forgot-password-request.dto';
import { HomePageResponseDTO } from '../dto/response/home-page-response.dto';

@Injectable()
export class DashboardService {

  constructor(
    private readonly incidentService: IncidentService,
    private readonly locationService: LocationService,
    private readonly itemService: ItemService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  public async getHomePageData(user: UserEntity): Promise<HomePageResponseDTO> {
    if (user.role === RoleEnum.ADMIN) {
      return await this.getHomePageForAdmin();
    }

    return await this.getHomePageForUser(user.id);
  }

  public async forgotPassword(host: string, forgotPasswordRequestDTO: ForgotPasswordRequestDTO): Promise<void> {
    await validateOrReject(forgotPasswordRequestDTO);

    await this.authService.requestForgotPasswordLink(host, forgotPasswordRequestDTO.email);
  }

  private async getHomePageForAdmin(): Promise<HomePageResponseDTO> {
    const totalOpenIncidents: number = await this.incidentService.findTotalIncidentsByStatusAndUser(IncidentStatusEnum.OPEN, 0);
    const totalPendingIncidents: number = await this.incidentService.findTotalIncidentsByStatusAndUser(IncidentStatusEnum.PENDING, 0);
    const totalClosedIncidents: number = await this.incidentService.findTotalIncidentsByStatusAndUser(IncidentStatusEnum.CLOSED, 0);
    const totalIncidents: number = await this.incidentService.findTotalIncidentsByStatusAndUser('', 0);
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

  private async getHomePageForUser(userId: number): Promise<HomePageResponseDTO> {
    const totalOpenIncidents: number = await this.incidentService.findTotalIncidentsByStatusAndUser(IncidentStatusEnum.OPEN, userId);
    const totalPendingIncidents: number = await this.incidentService.findTotalIncidentsByStatusAndUser(IncidentStatusEnum.PENDING, userId);
    const totalClosedIncidents: number = await this.incidentService.findTotalIncidentsByStatusAndUser(IncidentStatusEnum.CLOSED, userId);
    const totalIncidents: number = await this.incidentService.findTotalIncidentsByStatusAndUser('', userId);

    return new HomePageResponseDTO(
      totalOpenIncidents,
      totalPendingIncidents,
      totalClosedIncidents,
      totalIncidents,
      0,
      0,
      0,
      0,
    );
  }

}
