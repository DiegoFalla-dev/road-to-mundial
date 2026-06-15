/**
 * Mappers puros: convierten filas de persistencia (estructura plana, sin acoplar
 * a ningún ORM) en entidades del dominio. Viven en @rtm/core para ser testeables
 * sin base de datos; la PrismaDataSource solo consulta y delega aquí.
 */
import type {
  DefensiveStats,
  FormRecord,
  FormWindow,
  HeadToHead,
  MatchResult,
  OffensiveStats,
  SquadStatus,
  TeamProfile,
} from '../types';

/** Fila de FormRecord tal como la entrega la capa de persistencia. */
export interface FormRow {
  window: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  sequence: string; // CSV "W,D,L,..."
}

export interface TeamRow {
  id: string;
  name: string;
  code: string;
  confederation: string;
  historicalRating: number;
  tacticalRating: number;
  avgOpponentStrength: number;
  formRecords: FormRow[];
  offensive: OffensiveStats | null;
  defensive: DefensiveStats | null;
  squad: SquadStatus | null;
}

export interface HeadToHeadRow {
  teamId: string;
  opponentId: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

const ZERO_OFFENSIVE: OffensiveStats = {
  avgGoalsScored: 0,
  avgShots: 0,
  avgShotsOnTarget: 0,
  conversionRate: 0,
};
const ZERO_DEFENSIVE: DefensiveStats = {
  avgGoalsConceded: 0,
  cleanSheets: 0,
  avgShotsConceded: 0,
};
const ZERO_SQUAD: SquadStatus = {
  totalKeyPlayers: 11,
  keyPlayersAvailable: 11,
  injured: 0,
  suspended: 0,
};

function emptyForm(window: FormWindow): FormRecord {
  return {
    window,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    sequence: [],
  };
}

function parseSequence(csv: string): MatchResult[] {
  return csv
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter((s): s is MatchResult => s === 'W' || s === 'D' || s === 'L');
}

function mapForm(row: FormRow): FormRecord {
  return {
    window: row.window as FormWindow,
    played: row.played,
    wins: row.wins,
    draws: row.draws,
    losses: row.losses,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    sequence: parseSequence(row.sequence),
  };
}

/** Convierte una fila de equipo (con relaciones) en TeamProfile del dominio. */
export function mapTeamProfile(row: TeamRow): TeamProfile {
  const byWindow = new Map<number, FormRecord>();
  for (const f of row.formRecords) byWindow.set(f.window, mapForm(f));

  const form = {
    5: byWindow.get(5) ?? emptyForm(5),
    10: byWindow.get(10) ?? emptyForm(10),
    15: byWindow.get(15) ?? emptyForm(15),
  } as const;

  return {
    id: row.id,
    name: row.name,
    code: row.code,
    confederation: row.confederation,
    form,
    offensive: row.offensive ?? ZERO_OFFENSIVE,
    defensive: row.defensive ?? ZERO_DEFENSIVE,
    squad: row.squad ?? ZERO_SQUAD,
    avgOpponentStrength: row.avgOpponentStrength,
    historicalRating: row.historicalRating,
    tacticalRating: row.tacticalRating,
  };
}

/** Convierte una fila de historial directo en HeadToHead del dominio. */
export function mapHeadToHead(row: HeadToHeadRow): HeadToHead {
  return {
    teamId: row.teamId,
    opponentId: row.opponentId,
    matches: row.matches,
    wins: row.wins,
    draws: row.draws,
    losses: row.losses,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
  };
}

/** Serializa una secuencia de resultados a CSV para persistir. */
export function serializeSequence(seq: readonly MatchResult[]): string {
  return seq.join(',');
}
