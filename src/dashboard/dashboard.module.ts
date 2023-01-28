import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardObjectController } from './controller/dashboard-object.controller';

@Module({
  controllers: [DashboardController, DashboardObjectController],
  providers: [DashboardService]
})
export class DashboardModule {}
