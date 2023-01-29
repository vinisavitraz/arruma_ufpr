import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardObjectController } from './controller/dashboard-item.controller';
import { DashboardLocationController } from './controller/dashboard-location.controller';
import { DashboardIncidentController } from './controller/dashboard-incident.controller';

@Module({
  controllers: [
    DashboardController, 
    DashboardObjectController,
    DashboardLocationController,
    DashboardIncidentController,
  ],
  providers: [DashboardService]
})
export class DashboardModule {}
