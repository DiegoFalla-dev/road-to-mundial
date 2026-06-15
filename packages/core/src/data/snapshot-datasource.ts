/**
 * DataSource construido a partir de un WorldCupSnapshot.
 *
 * Permite que la salida del scraper/API alimente la aplicación SIN cambios en
 * el motor ni en los servicios: el snapshot se inyecta aquí y cumple el mismo
 * contrato `DataSource` que `SeedDataSource` o `PrismaDataSource`.
 */
import type { HeadToHead, TeamProfile } from '../types';
import type { DataSource } from './datasource';
import type { StandingMatchInput } from './standings';
import { buildTeamProfiles, type WorldCupSnapshot } from './snapshot';

export class SnapshotDataSource implements DataSource {
  private readonly teams: Map<string, TeamProfile>;
  private readonly h2h: HeadToHead[];
  private readonly snapshot: WorldCupSnapshot;

  constructor(snapshot: WorldCupSnapshot) {
    this.snapshot = snapshot;
    this.teams = new Map(buildTeamProfiles(snapshot).map((t) => [t.id, t]));
    this.h2h = buildHeadToHead(snapshot);
  }

  async listTeams(): Promise<TeamProfile[]> {
    return [...this.teams.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }

  async getTeam(id: string): Promise<TeamProfile | null> {
    return this.teams.get(id) ?? null;
  }

  async getHeadToHead(teamId: string, opponentId: string): Promise<HeadToHead | undefined> {
    return this.h2h.find((h) => h.teamId === teamId && h.opponentId === opponentId);
  }

  async listGroups(): Promise<Record<string, readonly string[]>> {
    return this.snapshot.groups as Record<string, readonly string[]>;
  }

  async listMatches(): Promise<StandingMatchInput[]> {
    return this.snapshot.matches.map((m) => ({ ...m }));
  }
}

/** Construye el historial directo (dirigido) a partir de los partidos jugados. */
export function buildHeadToHead(snapshot: WorldCupSnapshot): HeadToHead[] {
  const acc = new Map<string, HeadToHead>();
  const ensure = (teamId: string, opponentId: string): HeadToHead => {
    const key = `${teamId}|${opponentId}`;
    let rec = acc.get(key);
    if (!rec) {
      rec = { teamId, opponentId, matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
      acc.set(key, rec);
    }
    return rec;
  };

  for (const m of snapshot.matches) {
    if (m.status !== 'FINISHED' || m.homeScore == null || m.awayScore == null) continue;
    record(ensure(m.homeTeamId, m.awayTeamId), m.homeScore, m.awayScore);
    record(ensure(m.awayTeamId, m.homeTeamId), m.awayScore, m.homeScore);
  }
  return [...acc.values()];
}

function record(h: HeadToHead, gf: number, ga: number): void {
  const rec = h as { -readonly [K in keyof HeadToHead]: HeadToHead[K] };
  rec.matches += 1;
  rec.goalsFor += gf;
  rec.goalsAgainst += ga;
  if (gf > ga) rec.wins += 1;
  else if (gf === ga) rec.draws += 1;
  else rec.losses += 1;
}
