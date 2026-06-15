/**
 * Implementación de DataSource basada en el dataset real del Mundial 2026
 * (Flashscore, ver seed-data.ts).
 *
 * Cumple el contrato DataSource sin dependencias externas. Es la fuente por
 * defecto. Para producción puede sustituirse por SnapshotDataSource (API real)
 * o PrismaDataSource (PostgreSQL) sin que el motor ni los consumidores cambien.
 */
import type { HeadToHead, TeamProfile } from '../types';
import type { DataSource } from './datasource';
import type { StandingMatchInput } from './standings';
import { SEED_GROUPS, SEED_HEAD_TO_HEAD, SEED_TEAMS } from './seed-data';
import { SEED_MATCHES } from './fixtures';

export class SeedDataSource implements DataSource {
  private readonly teams: Map<string, TeamProfile>;
  private readonly h2h: HeadToHead[];

  constructor(
    teams: readonly TeamProfile[] = SEED_TEAMS,
    h2h: readonly HeadToHead[] = SEED_HEAD_TO_HEAD,
  ) {
    this.teams = new Map(teams.map((t) => [t.id, t]));
    this.h2h = [...h2h];
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
    return SEED_GROUPS;
  }

  async listMatches(): Promise<StandingMatchInput[]> {
    return SEED_MATCHES.map((m) => ({ ...m }));
  }
}
