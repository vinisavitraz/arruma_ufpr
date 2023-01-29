import { Module } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardItemController } from './controller/dashboard-item.controller';
import { DashboardLocationController } from './controller/dashboard-location.controller';
import { DashboardIncidentController } from './controller/dashboard-incident.controller';
import { LocationModule } from 'src/location/location.module';
import { DashboardLocationService } from './service/dashboard-location.service';

@Module({
  imports: [
    LocationModule,
  ],
  controllers: [
    DashboardController, 
    DashboardItemController,
    DashboardLocationController,
    DashboardIncidentController,
  ],
  providers: [
    DashboardService,
    DashboardLocationService
  ],
  exports: [DashboardService],
})
export class DashboardModule {}
