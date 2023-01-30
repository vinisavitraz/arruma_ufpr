import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { DatabaseModule } from 'src/database/database.module';
import { IncidentModule } from 'src/incident/incident.module';
import { LocationModule } from 'src/location/location.module';
import { ItemModule } from 'src/item/item.module';
import { UserModule } from 'src/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { ClassValidatorExceptionFilter } from './exception/filter/class-validator-exception-filter';
import { HttpOperationExceptionFilter } from './exception/filter/http-operation-exception-filter';
import { AllExceptionsFilter } from './exception/filter/all-exception-filter';

@Module({
  imports: [DatabaseModule, AuthModule, DashboardModule, LocationModule, ItemModule, UserModule, IncidentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpOperationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ClassValidatorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
