import { Controller, Get, Module } from '@nestjs/common';
import { MODEL_VERSION } from './common/tokens';
import { DataModule } from './data/data.module';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';
import { AnalysisModule } from './analysis/analysis.module';
import { StandingsModule } from './standings/standings.module';

@Controller()
class HealthController {
  /** GET /api/health */
  @Get('health')
  health() {
    return { status: 'ok', model: MODEL_VERSION, timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [DataModule, TeamsModule, MatchesModule, AnalysisModule, StandingsModule],
  controllers: [HealthController],
})
export class AppModule {}
