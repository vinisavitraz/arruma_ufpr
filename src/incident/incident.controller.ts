import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IncidentService } from './incident.service';

@Controller('incident')
@ApiTags('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}
}
