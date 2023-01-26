import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { DatabaseModule } from 'src/database/database.module';
import { IncidentModule } from 'src/incident/incident.module';
import { LocationModule } from 'src/location/location.module';
import { ObjectModule } from 'src/object/object.module';
import { UserModule } from 'src/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [DatabaseModule, AuthModule, DashboardModule, LocationModule, ObjectModule, UserModule, IncidentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
