import { Module } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardItemController } from './controller/dashboard-item.controller';
import { DashboardLocationController } from './controller/dashboard-location.controller';
import { DashboardIncidentController } from './controller/dashboard-incident.controller';
import { LocationModule } from 'src/location/location.module';
import { DashboardLocationService } from './service/dashboard-location.service';
import { DashboardIncidentService } from './service/dashboard-incident.service';
import { IncidentModule } from 'src/incident/incident.module';
import { ItemModule } from 'src/item/item.module';
import { DashboardItemService } from './service/dashboard-item.service';
import { UserModule } from 'src/user/user.module';
import { DashboardUserController } from './controller/dashboard-user.controller';
import { DashboardUserService } from './service/dashboard-user.service';

@Module({
  imports: [
    ItemModule,
    LocationModule,
    IncidentModule,
    UserModule,
  ],
  controllers: [
    DashboardController, 
    DashboardItemController,
    DashboardLocationController,
    DashboardIncidentController,
    DashboardUserController,
  ],
  providers: [
    DashboardService,
    DashboardItemService,
    DashboardLocationService,
    DashboardIncidentService,
    DashboardUserService,
  ],
})
export class DashboardModule {}
