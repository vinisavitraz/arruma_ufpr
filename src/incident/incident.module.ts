import { Module } from '@nestjs/common';
import { IncidentService } from './service/incident.service';
import { IncidentController } from './controller/incident.controller';
import { DatabaseModule } from 'src/database/database.module';
import { LocationModule } from 'src/location/location.module';
import { ItemModule } from 'src/item/item.module';
import { IncidentTypeController } from './controller/incident-type.controller';
import { IncidentTypeService } from './service/incident-type.service';

@Module({
  imports: [DatabaseModule, LocationModule, ItemModule],
  controllers: [IncidentController, IncidentTypeController],
  providers: [IncidentService, IncidentTypeService],
  exports: [IncidentService, IncidentTypeService],
})
export class IncidentModule {}
