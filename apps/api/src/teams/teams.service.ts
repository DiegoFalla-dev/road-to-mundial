import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DataSource, TeamProfile } from '@rtm/core';
import { SEED_FORMATIONS } from '@rtm/core';
import { DATA_SOURCE } from '../common/tokens';

@Injectable()
export class TeamsService {
  constructor(@Inject(DATA_SOURCE) private readonly data: DataSource) {}

  async list(): Promise<TeamProfile[]> {
    return this.data.listTeams();
  }

  async getOrFail(id: string): Promise<TeamProfile> {
    const team = await this.data.getTeam(id);
    if (!team) throw new NotFoundException(`Selección no encontrada: ${id}`);
    return team;
  }

  /** Perfil enriquecido con derivados útiles para la UI (formación, dif. de goles). */
  async profile(id: string) {
    const team = await this.getOrFail(id);
    const form10 = team.form[10];
    return {
      ...team,
      formation: SEED_FORMATIONS[id] ?? null,
      goalDifference: form10 ? form10.goalsFor - form10.goalsAgainst : 0,
    };
  }
}
