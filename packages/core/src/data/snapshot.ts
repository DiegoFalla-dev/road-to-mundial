/**
 * Snapshot del Mundial 2026 y su transformación al dominio.
 *
 * Un `WorldCupSnapshot` es la representación NORMALIZADA y cruda de los datos
 * extraídos de una fuente real (Flashscore vía @rtm/scraper). Esta capa es el
 * único lugar que conoce cómo convertir datos crudos en entidades del dominio
 * (`TeamProfile`, partidos), aplicando un encogimiento estadístico al prior
 * cuando hay pocos partidos disputados. Está testeada y es independiente del
 * origen: el scraper, el seed o cualquier proveedor producen el mismo snapshot.
 */
import type { FormRecord, FormWindow, MatchResult, TeamProfile } from '../types';

/** Selección dentro del snapshot. `strengthRating` es provisional (prior 0–100). */
export interface SnapshotTeam {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly confederation: string;
  /** Prior de fuerza 0–100 (p. ej. derivado del ranking FIFA). Provisional. */
  readonly strengthRating: number;
  readonly formation?: string;
}

/** Fila de clasificación agregada (lo que entrega la tabla de Flashscore). */
export interface SnapshotStanding {
  readonly teamId: string;
  readonly played: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
  /** Secuencia de resultados si la fuente la provee (más reciente al final). */
  readonly sequence?: readonly MatchResult[];
}

/** Estadísticas detalladas de un partido (cuando la extracción las tiene). */
export interface SnapshotMatchStats {
  readonly shots?: number;
  readonly shotsOnTarget?: number;
  readonly shotsConceded?: number;
}

/** Partido del snapshot (cruce intragrupo o eliminatoria). */
export interface SnapshotMatch {
  readonly id: string;
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly group: string;
  readonly stage: 'GROUP' | 'ROUND_32' | 'ROUND_16' | 'QUARTER' | 'SEMI' | 'FINAL';
  readonly status: 'SCHEDULED' | 'FINISHED';
  readonly kickoff?: string;
  readonly venue?: string;
  readonly homeScore?: number;
  readonly awayScore?: number;
  readonly homeStats?: SnapshotMatchStats;
  readonly awayStats?: SnapshotMatchStats;
}

export interface SnapshotProvenance {
  readonly source: string;
  readonly url?: string;
  readonly retrievedAt: string;
  readonly note?: string;
}

export interface WorldCupSnapshot {
  readonly provenance: SnapshotProvenance;
  readonly groups: Readonly<Record<string, readonly string[]>>;
  readonly teams: readonly SnapshotTeam[];
  readonly standings: readonly SnapshotStanding[];
  readonly matches: readonly SnapshotMatch[];
}

const clamp = (x: number, a: number, b: number): number => Math.min(b, Math.max(a, x));
const r2 = (x: number): number => Math.round(x * 100) / 100;

function emptyForm(window: FormWindow): FormRecord {
  return { window, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, sequence: [] };
}

function formFrom(window: FormWindow, s: SnapshotStanding | undefined): FormRecord {
  if (!s || s.played === 0) return emptyForm(window);
  const sequence =
    s.sequence && s.sequence.length > 0
      ? [...s.sequence]
      : ([s.wins > 0 ? 'W' : s.draws > 0 ? 'D' : 'L'] as MatchResult[]);
  return {
    window,
    played: s.played,
    wins: s.wins,
    draws: s.draws,
    losses: s.losses,
    goalsFor: s.goalsFor,
    goalsAgainst: s.goalsAgainst,
    sequence,
  };
}

/**
 * Suma de tiros reales por equipo a partir de los partidos finalizados del
 * snapshot. Devuelve undefined si la fuente aún no aporta tiros para el equipo.
 */
function aggregateShots(teamId: string, matches: readonly SnapshotMatch[]) {
  let shots = 0;
  let onTarget = 0;
  let conceded = 0;
  let games = 0;
  let hasData = false;
  for (const m of matches) {
    if (m.status !== 'FINISHED') continue;
    const isHome = m.homeTeamId === teamId;
    const isAway = m.awayTeamId === teamId;
    if (!isHome && !isAway) continue;
    const own = isHome ? m.homeStats : m.awayStats;
    if (!own || own.shots == null) continue;
    hasData = true;
    games += 1;
    shots += own.shots;
    onTarget += own.shotsOnTarget ?? 0;
    conceded += own.shotsConceded ?? 0;
  }
  if (!hasData || games === 0) return undefined;
  return { avgShots: shots / games, avgOnTarget: onTarget / games, avgConceded: conceded / games };
}

/**
 * Transforma un snapshot en perfiles del dominio. Para las métricas que la
 * fuente aún no mide (tiros sin partidos con stats) usa un prior por fuerza,
 * mezclado con la forma real disputada (encogimiento al prior). A medida que la
 * extracción aporta más partidos y stats, el dato real domina al prior.
 */
export function buildTeamProfiles(snapshot: WorldCupSnapshot): TeamProfile[] {
  const standingsById = new Map(snapshot.standings.map((s) => [s.teamId, s]));

  return snapshot.teams.map((team) => {
    const s = standingsById.get(team.id);
    const played = s?.played ?? 0;
    const gf = s?.goalsFor ?? 0;
    const ga = s?.goalsAgainst ?? 0;
    const rating = clamp(team.strengthRating, 0, 100);

    const priorAtk = clamp(0.8 + (rating - 50) / 35, 0.4, 2.6);
    const priorDef = clamp(1.6 - (rating - 50) / 45, 0.4, 2.4);
    const avgGoalsScored = played ? r2((gf / played + priorAtk) / 2) : r2(priorAtk);
    const avgGoalsConceded = played ? r2((ga / played + priorDef) / 2) : r2(priorDef);

    const realShots = aggregateShots(team.id, snapshot.matches);
    const avgShotsOnTarget = realShots
      ? r2(realShots.avgOnTarget)
      : r2(clamp(2.5 + (rating - 50) / 12, 1.5, 7));
    const avgShots = realShots ? r2(realShots.avgShots) : r2(avgShotsOnTarget * 2.6);
    const avgShotsConceded = realShots
      ? r2(realShots.avgConceded)
      : r2(clamp(13 - (rating - 50) / 10, 6, 16));
    const conversionRate = r2(clamp(avgGoalsScored / Math.max(0.1, avgShotsOnTarget), 0.05, 0.5));

    return {
      id: team.id,
      name: team.name,
      code: team.code,
      confederation: team.confederation,
      form: { 5: formFrom(5, s), 10: formFrom(10, s), 15: formFrom(15, s) },
      offensive: { avgGoalsScored, avgShots, avgShotsOnTarget, conversionRate },
      defensive: { avgGoalsConceded, cleanSheets: played && ga === 0 ? 1 : 0, avgShotsConceded },
      squad: { totalKeyPlayers: 11, keyPlayersAvailable: 11, injured: 0, suspended: 0 },
      avgOpponentStrength: Math.max(40, rating - 6),
      historicalRating: rating,
      tacticalRating: Math.max(40, rating - 3),
    };
  });
}

/** Mapa id → formación (para enriquecer el perfil en la UI). */
export function buildFormations(snapshot: WorldCupSnapshot): Record<string, string> {
  const out: Record<string, string> = {};
  for (const t of snapshot.teams) if (t.formation) out[t.id] = t.formation;
  return out;
}
