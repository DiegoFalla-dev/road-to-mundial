import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DataSource, MatchPrediction, TeamProfile } from '@rtm/core';
import { evaluateTeam, predictMatch } from '@rtm/core';
import { DATA_SOURCE, MODEL_VERSION } from '../common/tokens';

export interface ComparisonResult {
  home: TeamProfile;
  away: TeamProfile;
  homeRating: ReturnType<typeof evaluateTeam>;
  awayRating: ReturnType<typeof evaluateTeam>;
  prediction: MatchPrediction;
  modelVersion: string;
}

@Injectable()
export class AnalysisService {
  constructor(@Inject(DATA_SOURCE) private readonly data: DataSource) {}

  private async loadPair(homeId: string, awayId: string) {
    const [home, away] = await Promise.all([
      this.data.getTeam(homeId),
      this.data.getTeam(awayId),
    ]);
    if (!home) throw new NotFoundException(`Selección no encontrada: ${homeId}`);
    if (!away) throw new NotFoundException(`Selección no encontrada: ${awayId}`);
    const [h2hHome, h2hAway] = await Promise.all([
      this.data.getHeadToHead(homeId, awayId),
      this.data.getHeadToHead(awayId, homeId),
    ]);
    return { home, away, h2hHome, h2hAway };
  }

  /** Predicción completa de un enfrentamiento. */
  async predict(homeId: string, awayId: string): Promise<MatchPrediction> {
    const { home, away, h2hHome, h2hAway } = await this.loadPair(homeId, awayId);
    return predictMatch(home, away, h2hHome, h2hAway);
  }

  /** Comparación detallada con ratings desglosados + predicción. */
  async compare(homeId: string, awayId: string): Promise<ComparisonResult> {
    const { home, away, h2hHome, h2hAway } = await this.loadPair(homeId, awayId);
    return {
      home,
      away,
      homeRating: evaluateTeam(home, h2hHome),
      awayRating: evaluateTeam(away, h2hAway),
      prediction: predictMatch(home, away, h2hHome, h2hAway),
      modelVersion: MODEL_VERSION,
    };
  }
}
