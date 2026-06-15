import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalysisService } from '../analysis/analysis.service';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matches: MatchesService,
    private readonly analysis: AnalysisService,
  ) {}

  /** GET /api/matches/upcoming?limit=10 */
  @Get('upcoming')
  upcoming(@Query('limit') limit?: string) {
    return this.matches.upcoming(limit ? Number(limit) : 10);
  }

  /** GET /api/matches/finished?limit=10 */
  @Get('finished')
  finished(@Query('limit') limit?: string) {
    return this.matches.finished(limit ? Number(limit) : 10);
  }

  /** GET /api/matches/:id — vista de partido con predicción. */
  @Get(':id')
  async detail(@Param('id') id: string) {
    const match = await this.matches.getOrFail(id);
    const prediction = await this.analysis.predict(match.homeTeamId, match.awayTeamId);
    return { match, prediction };
  }
}
