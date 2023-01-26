import { Controller } from '@nestjs/common';
import { IncidentService } from './incident.service';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}
}
