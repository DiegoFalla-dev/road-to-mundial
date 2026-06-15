import { Controller, Get } from '@nestjs/common';
import { StandingsService } from './standings.service';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standings: StandingsService) {}

  /** GET /api/standings — tablas de los 12 grupos. */
  @Get()
  all() {
    return this.standings.all();
  }
}
