import { Module } from '@nestjs/common';
import { IncidentService } from './service/incident.service';
import { IncidentController } from './controller/incident.controller';
import { DatabaseModule } from 'src/database/database.module';
import { LocationModule } from 'src/location/location.module';
import { ItemModule } from 'src/item/item.module';
import { IncidentTypeController } from './controller/incident-type.controller';
import { IncidentTypeService } from './service/incident-type.service';
import { FileModule } from 'src/file/file.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, LocationModule, ItemModule, FileModule, UserModule],
  controllers: [IncidentController, IncidentTypeController],
  providers: [IncidentService, IncidentTypeService],
  exports: [IncidentService, IncidentTypeService],
})
export class IncidentModule {}
