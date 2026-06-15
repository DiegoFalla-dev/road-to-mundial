import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DataSource, SeedMatch } from '@rtm/core';
import { SEED_MATCHES } from '@rtm/core';
import { DATA_SOURCE } from '../common/tokens';

export interface MatchView extends SeedMatch {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamCode: string;
  awayTeamCode: string;
}

@Injectable()
export class MatchesService {
  constructor(@Inject(DATA_SOURCE) private readonly data: DataSource) {}

  private async decorate(match: SeedMatch): Promise<MatchView> {
    const [home, away] = await Promise.all([
      this.data.getTeam(match.homeTeamId),
      this.data.getTeam(match.awayTeamId),
    ]);
    return {
      ...match,
      homeTeamName: home?.name ?? match.homeTeamId,
      awayTeamName: away?.name ?? match.awayTeamId,
      homeTeamCode: home?.code ?? match.homeTeamId.toUpperCase(),
      awayTeamCode: away?.code ?? match.awayTeamId.toUpperCase(),
    };
  }

  /** Próximos partidos ordenados por fecha. */
  async upcoming(limit = 10): Promise<MatchView[]> {
    const scheduled = SEED_MATCHES.filter((m) => m.status === 'SCHEDULED').sort(
      (a, b) => a.kickoff.localeCompare(b.kickoff),
    );
    return Promise.all(scheduled.slice(0, limit).map((m) => this.decorate(m)));
  }

  /** Resultados ya disputados, más recientes primero. */
  async finished(limit = 10): Promise<MatchView[]> {
    const done = SEED_MATCHES.filter((m) => m.status === 'FINISHED').sort((a, b) =>
      b.kickoff.localeCompare(a.kickoff),
    );
    return Promise.all(done.slice(0, limit).map((m) => this.decorate(m)));
  }

  async getOrFail(id: string): Promise<MatchView> {
    const match = SEED_MATCHES.find((m) => m.id === id);
    if (!match) throw new NotFoundException(`Partido no encontrado: ${id}`);
    return this.decorate(match);
  }
}
