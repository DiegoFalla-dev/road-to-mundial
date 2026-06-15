import { Inject, Injectable } from '@nestjs/common';
import { computeStandings, type DataSource, type StandingRow } from '@rtm/core';
import { DATA_SOURCE } from '../common/tokens';

export interface StandingRowView extends StandingRow {
  name: string;
  code: string;
}

export interface GroupStandings {
  group: string;
  rows: StandingRowView[];
}

@Injectable()
export class StandingsService {
  constructor(@Inject(DATA_SOURCE) private readonly data: DataSource) {}

  /** Tablas de todos los grupos, ordenadas, con nombre y código de cada equipo. */
  async all(): Promise<GroupStandings[]> {
    if (!this.data.listGroups || !this.data.listMatches) return [];
    const [groups, matches, teams] = await Promise.all([
      this.data.listGroups(),
      this.data.listMatches(),
      this.data.listTeams(),
    ]);
    const meta = new Map(teams.map((t) => [t.id, t]));
    const tables = computeStandings(groups, matches);

    return Object.entries(tables)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, rows]) => ({
        group,
        rows: rows.map((r) => ({
          ...r,
          name: meta.get(r.teamId)?.name ?? r.teamId,
          code: meta.get(r.teamId)?.code ?? r.teamId.toUpperCase(),
        })),
      }));
  }
}
