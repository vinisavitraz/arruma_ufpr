import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { DatabaseModule } from 'src/database/database.module';
import { LocationModule } from 'src/location/location.module';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [DatabaseModule, LocationModule, ItemModule],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}
