import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LocationModule } from './location/location.module';
import { ObjectModule } from './object/object.module';
import { UserModule } from './user/user.module';
import { IncidentModule } from './incident/incident.module';

@Module({
  imports: [DatabaseModule, AuthModule, DashboardModule, LocationModule, ObjectModule, UserModule, IncidentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
